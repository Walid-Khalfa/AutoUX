// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title AutoUXRegistry – On-chain proof of AI reports (hash anchoring)
/// @notice Stores a content hash (SHA-256) for a given string reportId.
///         Enables cheap public verification: (reportId, hash) -> bool.
/// @dev Privacy-first: only hashes are stored, no sensitive data on-chain
contract AutoUXRegistry {
    struct Record {
        bytes32 contentHash;   // e.g., sha256(report.json)
        address uploader;      // msg.sender that anchored the hash
        uint64  timestamp;     // block time for audit trail
    }

    /// @dev Latest record by reportId (you can version by changing reportId, e.g. run-001-v2)
    mapping(string => Record) private _records;

    event HashStored(
        string indexed reportId, 
        bytes32 indexed contentHash, 
        address indexed uploader, 
        uint64 timestamp
    );

    /// @notice Store or update the content hash for a reportId.
    /// @dev Anyone can write; your UI can restrict to connected wallet.
    /// @param reportId Unique identifier for the report
    /// @param contentHash SHA-256 hash of the report content
    function storeHash(string calldata reportId, bytes32 contentHash) external {
        require(contentHash != bytes32(0), "Hash cannot be zero");
        require(bytes(reportId).length > 0, "ReportId cannot be empty");
        
        _records[reportId] = Record({
            contentHash: contentHash,
            uploader: msg.sender,
            timestamp: uint64(block.timestamp)
        });
        
        emit HashStored(reportId, contentHash, msg.sender, uint64(block.timestamp));
    }

    /// @notice Verify a pair (reportId, hash) against the latest stored value.
    /// @param reportId The report identifier to verify
    /// @param contentHash The hash to verify against
    /// @return bool True if the hash matches and exists
    function verifyHash(string calldata reportId, bytes32 contentHash) external view returns (bool) {
        return _records[reportId].contentHash == contentHash && _records[reportId].contentHash != bytes32(0);
    }

    /// @notice Read the latest record (for UI display).
    /// @param reportId The report identifier to query
    /// @return contentHash The stored hash
    /// @return uploader The address that stored the hash
    /// @return timestamp The block timestamp when stored
    function getRecord(string calldata reportId) external view returns (
        bytes32 contentHash, 
        address uploader, 
        uint64 timestamp
    ) {
        Record memory r = _records[reportId];
        return (r.contentHash, r.uploader, r.timestamp);
    }
}
