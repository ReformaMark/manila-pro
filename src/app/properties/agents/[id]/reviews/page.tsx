'use client'
import { useParams } from "next/navigation";
import AgentReviews from "./_components/agent-reviews";


export default function Page() {
  const params = useParams();
  const agentId = params.id as string;
  return (
    <div>
      <AgentReviews agentId={agentId}/>
    </div>
  )
}
