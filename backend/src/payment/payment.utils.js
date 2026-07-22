const formatAmountInINR = (amountInPaise) => {
  return amountInPaise / 100;
};

const formatAmountToPaise = (amountInINR) => {
  return Math.round(amountInINR * 100);
};

module.exports = {
  formatAmountInINR,
  formatAmountToPaise
};
