import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleHelp } from "lucide-react"

type Props = {
  question: string
}
export const Question = ({ question }:Props) =>{
  return (
  <Tooltip>
    <TooltipTrigger asChild>
      <CircleHelp className="w-3 h-3"/>
    </TooltipTrigger>
    <TooltipContent autoFocus align="start" className="bg-white drop-shadow-lg">
      <p>{question}</p>
    </TooltipContent>
  </Tooltip>
  )
}