import { useState } from 'react';
import { gameService } from '../services/gameService';
import toast from 'react-hot-toast';

export const useGame = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [lastGame, setLastGame] = useState(null);

  const rollDice = async (betAmount) => {
    setIsRolling(true);
    try {
      const res = await gameService.play(betAmount);
      if (res.success) {
        setLastGame(res.data.game);
        return res.data;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Dice roll failed');
      throw err;
    } finally {
      setIsRolling(false);
    }
  };

  return { rollDice, isRolling, lastGame };
};
