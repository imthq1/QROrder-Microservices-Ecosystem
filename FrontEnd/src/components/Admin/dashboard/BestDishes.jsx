import sandwich from "../../../assets/download.jpg";
import chicken from "../../../assets/download.jpg";
import burger from "../../../assets/download.jpg";

const BestDishes = () => {
  return (
    <div className="card">
      <h4>Best Dishes</h4>

      <div className="dish">
        <img src={sandwich} />
        <div>
          <p>Grill Sandwich</p>
          <span>$30.00</span>
        </div>
        <strong>200</strong>
      </div>

      <div className="dish">
        <img src={chicken} />
        <div>
          <p>Chicken Popeyes</p>
          <span>$20.00</span>
        </div>
        <strong>400</strong>
      </div>

      <div className="dish">
        <img src={burger} />
        <div>
          <p>Bison Burgers</p>
          <span>$50.00</span>
        </div>
        <strong>250</strong>
      </div>
    </div>
  );
};

export default BestDishes;
