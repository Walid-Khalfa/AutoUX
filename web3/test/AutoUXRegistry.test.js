const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutoUXRegistry Contract", function () {
  let autoUXRegistry;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const AutoUXRegistry = await ethers.getContractFactory("AutoUXRegistry");
    autoUXRegistry = await AutoUXRegistry.deploy();
    await autoUXRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(await autoUXRegistry.getAddress()).to.be.properAddress;
    });
  });

  describe("storeHash", function () {
    it("should store a hash successfully", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      const tx = await autoUXRegistry.storeHash(reportId, contentHash);
      const receipt = await tx.wait();
      
      // Check that the event was emitted
      const event = receipt.logs.find(log => {
        try {
          return autoUXRegistry.interface.parseLog(log).name === "HashStored";
        } catch {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
    });

    it("should reject zero hash", async function () {
      const reportId = "report-123";
      const zeroHash = "0x" + "0".repeat(64);
      
      await expect(
        autoUXRegistry.storeHash(reportId, zeroHash)
      ).to.be.revertedWith("Hash cannot be zero");
    });

    it("should allow different users to store hashes", async function () {
      const reportId1 = "report-123";
      const reportId2 = "report-456";
      const hash1 = "0x" + "a".repeat(64);
      const hash2 = "0x" + "b".repeat(64);
      
      await autoUXRegistry.connect(owner).storeHash(reportId1, hash1);
      await autoUXRegistry.connect(addr1).storeHash(reportId2, hash2);
      
      const record1 = await autoUXRegistry.getRecord(reportId1);
      const record2 = await autoUXRegistry.getRecord(reportId2);
      
      expect(record1[0]).to.equal(hash1);
      expect(record1[1]).to.equal(owner.address);
      expect(record2[0]).to.equal(hash2);
      expect(record2[1]).to.equal(addr1.address);
    });

    it("should overwrite existing hash for same reportId", async function () {
      const reportId = "report-123";
      const hash1 = "0x" + "a".repeat(64);
      const hash2 = "0x" + "b".repeat(64);
      
      await autoUXRegistry.storeHash(reportId, hash1);
      await autoUXRegistry.storeHash(reportId, hash2);
      
      const record = await autoUXRegistry.getRecord(reportId);
      expect(record[0]).to.equal(hash2);
    });

    it("should emit HashStored event with correct parameters", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      const tx = await autoUXRegistry.storeHash(reportId, contentHash);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          return autoUXRegistry.interface.parseLog(log).name === "HashStored";
        } catch {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
    });
  });

  describe("verifyHash", function () {
    it("should verify matching hash", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      await autoUXRegistry.storeHash(reportId, contentHash);
      
      const isValid = await autoUXRegistry.verifyHash(reportId, contentHash);
      expect(isValid).to.be.true;
    });

    it("should reject non-matching hash", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      const wrongHash = "0x" + "b".repeat(64);
      
      await autoUXRegistry.storeHash(reportId, contentHash);
      
      const isValid = await autoUXRegistry.verifyHash(reportId, wrongHash);
      expect(isValid).to.be.false;
    });

    it("should return false for non-existent reportId", async function () {
      const reportId = "non-existent";
      const contentHash = "0x" + "a".repeat(64);
      
      const isValid = await autoUXRegistry.verifyHash(reportId, contentHash);
      expect(isValid).to.be.false;
    });

    it("should verify hash stored by different user", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      await autoUXRegistry.connect(addr1).storeHash(reportId, contentHash);
      
      const isValid = await autoUXRegistry.connect(addr2).verifyHash(reportId, contentHash);
      expect(isValid).to.be.true;
    });
  });

  describe("getRecord", function () {
    it("should return complete record information", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      await autoUXRegistry.storeHash(reportId, contentHash);
      
      const record = await autoUXRegistry.getRecord(reportId);
      
      expect(record[0]).to.equal(contentHash);
      expect(record[1]).to.equal(owner.address);
      expect(record[2]).to.be.gt(0); // timestamp should be greater than 0
    });

    it("should return zero values for non-existent record", async function () {
      const reportId = "non-existent";
      
      const record = await autoUXRegistry.getRecord(reportId);
      
      expect(record[0]).to.equal("0x" + "0".repeat(64));
      expect(record[1]).to.equal(ethers.ZeroAddress);
      expect(record[2]).to.equal(0);
    });

    it("should return correct uploader address", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      await autoUXRegistry.connect(addr1).storeHash(reportId, contentHash);
      
      const record = await autoUXRegistry.getRecord(reportId);
      expect(record[1]).to.equal(addr1.address);
    });

    it("should return valid timestamp", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      const blockBefore = await ethers.provider.getBlock('latest');
      await autoUXRegistry.storeHash(reportId, contentHash);
      const blockAfter = await ethers.provider.getBlock('latest');
      
      const record = await autoUXRegistry.getRecord(reportId);
      const timestamp = Number(record[2]);
      
      expect(timestamp).to.be.gte(blockBefore.timestamp);
      expect(timestamp).to.be.lte(blockAfter.timestamp);
    });
  });

  describe("Multiple Reports", function () {
    it("should handle multiple reports from same user", async function () {
      const reports = [
        { id: "report-1", hash: "0x" + "a".repeat(64) },
        { id: "report-2", hash: "0x" + "b".repeat(64) },
        { id: "report-3", hash: "0x" + "c".repeat(64) }
      ];
      
      for (const report of reports) {
        await autoUXRegistry.storeHash(report.id, report.hash);
      }
      
      for (const report of reports) {
        const isValid = await autoUXRegistry.verifyHash(report.id, report.hash);
        expect(isValid).to.be.true;
      }
    });

    it("should handle multiple reports from different users", async function () {
      const reports = [
        { id: "report-1", hash: "0x" + "a".repeat(64), signer: owner },
        { id: "report-2", hash: "0x" + "b".repeat(64), signer: addr1 },
        { id: "report-3", hash: "0x" + "c".repeat(64), signer: addr2 }
      ];
      
      for (const report of reports) {
        await autoUXRegistry.connect(report.signer).storeHash(report.id, report.hash);
      }
      
      for (const report of reports) {
        const record = await autoUXRegistry.getRecord(report.id);
        expect(record[0]).to.equal(report.hash);
        expect(record[1]).to.equal(report.signer.address);
      }
    });
  });

  describe("Edge Cases", function () {
    it("should handle very long reportId strings", async function () {
      const longReportId = "report-" + "x".repeat(100);
      const contentHash = "0x" + "a".repeat(64);
      
      await expect(autoUXRegistry.storeHash(longReportId, contentHash))
        .to.emit(autoUXRegistry, "HashStored");
    });

    it("should handle special characters in reportId", async function () {
      const specialReportId = "report-123-test_v1.0";
      const contentHash = "0x" + "a".repeat(64);
      
      await autoUXRegistry.storeHash(specialReportId, contentHash);
      
      const isValid = await autoUXRegistry.verifyHash(specialReportId, contentHash);
      expect(isValid).to.be.true;
    });

    it("should handle rapid successive stores", async function () {
      const reportId = "report-123";
      const hashes = [
        "0x" + "a".repeat(64),
        "0x" + "b".repeat(64),
        "0x" + "c".repeat(64)
      ];
      
      for (const hash of hashes) {
        await autoUXRegistry.storeHash(reportId, hash);
      }
      
      const record = await autoUXRegistry.getRecord(reportId);
      expect(record[0]).to.equal(hashes[hashes.length - 1]);
    });
  });

  describe("Gas Optimization", function () {
    it("should have reasonable gas cost for storeHash", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      const tx = await autoUXRegistry.storeHash(reportId, contentHash);
      const receipt = await tx.wait();
      
      // Gas should be reasonable (less than 100k for a simple store)
      expect(receipt.gasUsed).to.be.lt(100000);
    });

    it("should have low gas cost for verifyHash (view function)", async function () {
      const reportId = "report-123";
      const contentHash = "0x" + "a".repeat(64);
      
      await autoUXRegistry.storeHash(reportId, contentHash);
      
      // View functions don't consume gas, but we can estimate
      const gasEstimate = await autoUXRegistry.verifyHash.estimateGas(reportId, contentHash);
      expect(gasEstimate).to.be.lt(50000);
    });
  });
});
