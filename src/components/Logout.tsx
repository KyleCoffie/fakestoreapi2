import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

type LogoutProps = {
  className?: string;
};

const Logout: React.FC<LogoutProps> = ({ className }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const logoutUser = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("User logged out");
      navigate('/login');
    } catch (error:any) {
      setError("Logout failed. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={logoutUser} disabled={loading} className={className}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Logout;
