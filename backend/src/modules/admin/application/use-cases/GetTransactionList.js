class GetTransactionList {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async execute(filters = {}) {
    return this.paymentRepository.getTransactions(filters);
  }
}

module.exports = GetTransactionList;
