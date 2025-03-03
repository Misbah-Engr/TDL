const transactionInput = document.getElementById('transactionInput');
const decodeButton = document.getElementById('decodeButton');
const decodedOutput = document.getElementById('decodedOutput');

const tokens = {
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": { symbol: "USDC", decimals: 6 },
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": { symbol: "USDT", decimals: 6 },
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": { symbol: "WETH", decimals: 18 },
};

decodeButton.addEventListener('click', () => {
    const rawData = transactionInput.value.trim();
    if (!rawData) return;

    console.log("Raw data:", rawData); // Inspect raw data

    try {
        const transaction = ethers.utils.parseTransaction(rawData);
        console.log("Transaction:", transaction); // Inspect parsed transaction

        if (transaction.data.startsWith('0xa9059cbb')) { // ERC-20 transfer
            const to = ethers.utils.getAddress('0x' + transaction.data.slice(34, 74));
            const amountHex = '0x' + transaction.data.slice(74, 138);
            const tokenAddress = transaction.to;
            const tokenInfo = tokens[tokenAddress];

            console.log("Token address:", tokenAddress); // Inspect token address

            if (tokenInfo) {
                const amount = ethers.utils.formatUnits(ethers.BigNumber.from(amountHex), tokenInfo.decimals);
                decodedOutput.innerHTML = `Token transfer: ${amount} ${tokenInfo.symbol} to <a href="https://etherscan.io/address/${to}" target="_blank">${to}</a>`;
            } else {
                decodedOutput.innerHTML = 'Unknown token transfer.';
            }
        } else if (transaction.value && transaction.value.gt(0)) { // ETH transfer
            const ethAmount = ethers.utils.formatEther(transaction.value);
            decodedOutput.innerHTML = `ETH transfer: ${ethAmount} ETH to <a href="https://etherscan.io/address/${transaction.to}" target="_blank">${transaction.to}</a>`;
        } else {
            decodedOutput.innerHTML = 'Transaction type not recognized.';
        }
    } catch (error) {
        console.error("Decoding error:", error); // Log the error
        decodedOutput.innerHTML = 'Invalid transaction data.';
    }
});
                  
