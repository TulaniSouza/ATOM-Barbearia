const LoyaltyCard = ({ cutsCount }) => {
  const goal = 10;
  const progress = (cutsCount / goal) * 100;

  return (
    <div className="loyalty-card">
      <h3>Seu Clube de Vantagens ✂️</h3>
      <p>Você já fez {cutsCount} cortes!</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{goal - cutsCount} cortes faltam para você ganhar o 11º grátis!</p>
    </div>
  );
};
