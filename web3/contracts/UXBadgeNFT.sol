// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title UXBadgeNFT – ERC-721 NFT badges for AutoUX reports
/// @notice Mint NFT badges representing UX analysis achievements
/// @dev Each NFT represents a verified UX report with score, hash, and timestamp
contract UXBadgeNFT is ERC721, ERC721URIStorage, Ownable {
    
    struct BadgeMetadata {
        uint256 uxScore;        // UX score (0-100)
        bytes32 reportHash;     // SHA-256 hash of the report
        uint64 timestamp;       // Minting timestamp
        string reportId;        // Report identifier
    }

    /// @dev Token ID counter
    uint256 private _nextTokenId;
    
    /// @dev Mapping from token ID to badge metadata
    mapping(uint256 => BadgeMetadata) private _badgeMetadata;
    
    /// @dev Mapping from report hash to token ID (prevent duplicate minting)
    mapping(bytes32 => uint256) private _hashToTokenId;
    
    /// @dev Mapping from report owner to their token IDs
    mapping(address => uint256[]) private _ownerTokens;

    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 uxScore,
        bytes32 indexed reportHash,
        string reportId,
        uint64 timestamp
    );

    constructor() ERC721("AutoUX Badge", "UXBADGE") Ownable(msg.sender) {
        _nextTokenId = 1; // Start token IDs at 1
    }

    /// @notice Mint a new UX Badge NFT
    /// @dev Only the report owner can mint. Prevents duplicate minting for same hash.
    /// @param to Address to receive the NFT (must be msg.sender for access control)
    /// @param uxScore The UX score from the report (0-100)
    /// @param reportHash SHA-256 hash of the report
    /// @param reportId Unique identifier for the report
    /// @param tokenURI_ IPFS URI containing the NFT metadata
    /// @return tokenId The ID of the newly minted token
    function mint(
        address to,
        uint256 uxScore,
        bytes32 reportHash,
        string calldata reportId,
        string calldata tokenURI_
    ) external returns (uint256) {
        require(to == msg.sender, "Can only mint to yourself");
        require(uxScore <= 100, "Score must be 0-100");
        require(reportHash != bytes32(0), "Invalid report hash");
        require(bytes(reportId).length > 0, "ReportId cannot be empty");
        require(bytes(tokenURI_).length > 0, "TokenURI cannot be empty");
        require(_hashToTokenId[reportHash] == 0, "Badge already minted for this report");

        uint256 tokenId = _nextTokenId++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        
        _badgeMetadata[tokenId] = BadgeMetadata({
            uxScore: uxScore,
            reportHash: reportHash,
            timestamp: uint64(block.timestamp),
            reportId: reportId
        });
        
        _hashToTokenId[reportHash] = tokenId;
        _ownerTokens[to].push(tokenId);
        
        emit BadgeMinted(
            tokenId,
            to,
            uxScore,
            reportHash,
            reportId,
            uint64(block.timestamp)
        );
        
        return tokenId;
    }

    /// @notice Get badge metadata for a token
    /// @param tokenId The token ID to query
    /// @return uxScore The UX score
    /// @return reportHash The report hash
    /// @return timestamp The minting timestamp
    /// @return reportId The report identifier
    function getBadgeMetadata(uint256 tokenId) external view returns (
        uint256 uxScore,
        bytes32 reportHash,
        uint64 timestamp,
        string memory reportId
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        BadgeMetadata memory metadata = _badgeMetadata[tokenId];
        return (
            metadata.uxScore,
            metadata.reportHash,
            metadata.timestamp,
            metadata.reportId
        );
    }

    /// @notice Check if a badge has been minted for a specific report hash
    /// @param reportHash The report hash to check
    /// @return tokenId The token ID (0 if not minted)
    function getTokenIdByHash(bytes32 reportHash) external view returns (uint256) {
        return _hashToTokenId[reportHash];
    }

    /// @notice Get all token IDs owned by an address
    /// @param owner The address to query
    /// @return tokenIds Array of token IDs
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerTokens[owner];
    }

    /// @notice Get the total number of minted badges
    /// @return count The total supply
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // Override required functions for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
