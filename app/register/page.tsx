"use client";

import { StageTeam } from "@/components/register/StageTeam";
import { StagePlayers } from "@/components/register/StagePlayers";
import { StageContainer } from "@/components/register/StageContainer";
import { useRegistration } from "@/lib/registration-context";

export default function RegisterPage() {
  const { stage } = useRegistration();

  return (
    <StageContainer stage={stage}>
      {stage === 1 && <StageTeam />}
      {stage === 2 && <StagePlayers />}
      {/* stage 3, 4 will be added later */}
    </StageContainer>
  );
}

