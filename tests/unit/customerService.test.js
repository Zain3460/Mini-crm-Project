const customerService = require('../../src/services/customerService');
const { Customer } = require('../../src/models');

// Mocking Sequelize model
jest.mock('../../src/models', () => ({
  Customer: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  Op: { ne: 'ne' }
}));

describe('CustomerService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('normalizeTRPhone', () => {
    it('should normalize 10 digit phone', () => {
      expect(customerService.normalizeTRPhone('5321234567')).toBe('+905321234567');
    });

    it('should normalize phone starting with 0', () => {
      expect(customerService.normalizeTRPhone('05321234567')).toBe('+905321234567');
    });
  });

  describe('createCustomer', () => {
    it('should throw error if firstName is missing', async () => {
      await expect(customerService.createCustomer({})).rejects.toThrow('firstName is required');
    });

    it('should throw error if customer with same phone exists', async () => {
      Customer.findOne.mockResolvedValue({ id: 1 });
      await expect(customerService.createCustomer({ firstName: 'John', phone: '5321234567' }))
        .rejects.toThrow('Customer with same phone already exists');
    });
  });
});
