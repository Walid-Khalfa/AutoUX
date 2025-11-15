import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abbreviateAddress, getEtherscanTxUrl } from '../web3/hashUtils';
import ABI_REGISTRY from '../web3/abiAutoUXRegistry.json';

const REGISTRY_ADDRESS = import.meta.env.VITE_REGISTRY_ADDRESS;
const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME;
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo';

/**
 * OnChainHistory Component
 * Displays user's past on-chain anchored reports from Sepolia blockchain
 */
export default function OnChainHistory({ userAddress }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch history when userAddress changes
  useEffect(() => {
    if (userAddress) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [userAddress]);

  const fetchHistory = async () => {
    if (!userAddress) {
      setError('No wallet connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create read-only provider
      const provider = new ethers.JsonRpcProvider(RPC_URL);

      // Create contract instance
      const contract = new ethers.Contract(REGISTRY_ADDRESS, ABI_REGISTRY, provider);

      // Create filter for HashStored events by this user
      const filter = contract.filters.HashStored(null, null, userAddress);

      // Query events from the last ~10,000 blocks (approximately 1 day on Sepolia)
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000);
      
      const events = await contract.queryFilter(filter, fromBlock);

      // Parse events into history records
      const records = await Promise.all(
        events.map(async (event) => {
          try {
            // Get block timestamp
            const block = await event.getBlock();
            
            return {
              reportId: event.args.reportId,
              hash: event.args.contentHash,
              uploader: event.args.uploader,
              timestamp: Number(event.args.timestamp),
              blockTimestamp: block.timestamp,
              txHash: event.transactionHash,
              blockNumber: event.blockNumber,
            };
          } catch (err) {
            console.error('Error parsing event:', err);
            return null;
          }
        })
      );

      // Filter out any null records and sort by timestamp (newest first)
      const validRecords = records
        .filter(record => record !== null)
        .sort((a, b) => b.timestamp - a.timestamp);

      setHistory(validRecords);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch on-chain history. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = history.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Try to get UX score from sessionStorage if available
  const getCachedScore = (reportId) => {
    try {
      const cached = sessionStorage.getItem(`report-${reportId}`);
      if (cached) {
        const report = JSON.parse(cached);
        return report.uxScore;
      }
    } catch (err) {
      // Ignore errors
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📜 Your On-Chain Anchors</h2>
          <p className="text-sm text-gray-600 mt-1">
            View all reports you've anchored on {CHAIN_NAME}
          </p>
        </div>
        <button
          onClick={fetchHistory}
          disabled={loading || !userAddress}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          aria-label="Refresh history"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          <span>{loading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!userAddress && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔌</div>
          <p className="text-gray-600 text-lg">
            Connect your wallet to view your on-chain history
          </p>
        </div>
      )}

      {userAddress && !loading && history.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 text-lg font-medium mb-2">
            No anchored reports yet
          </p>
          <p className="text-gray-500 text-sm">
            Anchor your first report above to see it here!
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Fetching your on-chain records...</p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Report ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    UX Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Hash
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => {
                  const cachedScore = getCachedScore(record.reportId);
                  return (
                    <tr
                      key={`${record.txHash}-${index}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-gray-900">
                          {record.reportId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {cachedScore !== null ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {cachedScore}/100
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="font-mono text-xs text-gray-600"
                          title={record.hash}
                        >
                          {formatHash(record.hash)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {formatDate(record.timestamp)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={getEtherscanTxUrl(record.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
                        >
                          View →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {currentRecords.map((record, index) => {
              const cachedScore = getCachedScore(record.reportId);
              return (
                <div
                  key={`${record.txHash}-${index}`}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Report ID</p>
                      <p className="font-mono text-sm text-gray-900 break-all">
                        {record.reportId}
                      </p>
                    </div>
                    {cachedScore !== null && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                        {cachedScore}/100
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Hash</p>
                    <p className="font-mono text-xs text-gray-600 break-all" title={record.hash}>
                      {formatHash(record.hash)}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(record.timestamp)}
                    </p>
                  </div>

                  <a
                    href={getEtherscanTxUrl(record.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View on Etherscan →
                  </a>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, history.length)} of {history.length} records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  aria-label="Previous page"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
