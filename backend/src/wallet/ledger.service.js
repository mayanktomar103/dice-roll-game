const Transaction = require('./transaction.model');
const crypto = require('crypto');

class LedgerService {
  static async recordTransaction({
    user,
    type,
    amount,
    balanceBefore,
    balanceAfter,
    status = 'completed',
    reference = ''
  }) {
    const transactionId = `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const transaction = await Transaction.create({
      transactionId,
      user,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      status,
      reference
    });

    return transaction;
  }
}

module.exports = LedgerService;
