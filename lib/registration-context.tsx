"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Player {
  name: string;
  email: string;
  phone: string;
  division: string;
}

export interface RegistrationData {
  teamName: string;
  leader: Player;
  players: Player[]; // additional players (stage 2)
  paymentRef: string;
  paymentScreenshot: string;
}

export type RegistrationStage = 1 | 2 | 3 | 4;

interface RegistrationContextValue {
  data: RegistrationData;
  stage: RegistrationStage;
  setStage: (stage: RegistrationStage) => void;
  updateData: (patch: Partial<RegistrationData>) => void;
  updateLeader: (patch: Partial<Player>) => void;
  addPlayer: (player: Player) => void;
  resetPlayers: () => void;
}

const DEFAULT_DATA: RegistrationData = {
  teamName: "",
  leader: { name: "", email: "", phone: "", division: "" },
  players: [],
  paymentRef: "",
  paymentScreenshot: "",
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistrationData>(DEFAULT_DATA);
  const [stage, setStage] = useState<RegistrationStage>(1);

  const updateData = useCallback((patch: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateLeader = useCallback((patch: Partial<Player>) => {
    setData((prev) => ({
      ...prev,
      leader: { ...prev.leader, ...patch },
    }));
  }, []);

  const addPlayer = useCallback((player: Player) => {
    setData((prev) => ({
      ...prev,
      players: [...prev.players, player],
    }));
  }, []);

  const resetPlayers = useCallback(() => {
    setData((prev) => ({ ...prev, players: [] }));
  }, []);

  const value = useMemo(
    () => ({ data, stage, setStage, updateData, updateLeader, addPlayer, resetPlayers }),
    [data, stage, setStage, updateData, updateLeader, addPlayer, resetPlayers]
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return ctx;
}
