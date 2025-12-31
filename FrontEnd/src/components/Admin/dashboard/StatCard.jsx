const StatCard = () => {
  return (
    <div className="card">
      <h4>Total Balance</h4>
      <h2 className="green">$30,000</h2>

      <div className="stat-row">
        <span>Total Income</span>
        <strong>$4,500</strong>
      </div>

      <div className="stat-row">
        <span>Total Expense</span>
        <strong>$2,500</strong>
      </div>
    </div>
  );
};

export default StatCard;
