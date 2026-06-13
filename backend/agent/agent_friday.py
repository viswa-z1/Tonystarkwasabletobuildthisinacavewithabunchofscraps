"""
F.R.I.D.A.Y. Voice Agent (Cloud Version)
Adapted from: SAGAR-TAMANG/friday-tony-stark-demo
"""
import os
import logging
from datetime import datetime
from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.voice import Agent, AgentSession
from livekit.agents.llm import mcp
from livekit.plugins import silero

from providers.stt import build_stt
from providers.llm import build_llm
from providers.tts import build_tts
from prompts.friday_system_prompt import SYSTEM_PROMPT
from config import config

load_dotenv()
logger = logging.getLogger("friday-agent")


def _time_based_greeting() -> str:
    hour = datetime.now().hour
    if 5 <= hour < 12:
        return "Greetings boss, good morning. FRIDAY online. What can I do for you?"
    elif 12 <= hour < 17:
        return "Greetings boss, good afternoon. FRIDAY online. What can I do for you?"
    elif 17 <= hour < 21:
        return "Greetings boss, good evening. FRIDAY online. What can I do for you?"
    elif 21 <= hour < 24:
        return "Greetings boss, you're up late tonight. FRIDAY online. What do you need?"
    else:
        return "Greetings boss, burning the midnight oil again? FRIDAY online. At your service."


class FridayAgent(Agent):
    def __init__(self, stt, llm, tts) -> None:
        super().__init__(
            instructions=SYSTEM_PROMPT,
            stt=stt,
            llm=llm,
            tts=tts,
            vad=silero.VAD.load(),
            mcp_servers=[
                mcp.MCPServerHTTP(
                    url=os.getenv("MCP_SERVER_URL", "http://mcp_server:8000/sse"),
                    transport_type="sse",
                    client_session_timeout_seconds=30,
                ),
            ],
        )

    async def on_enter(self) -> None:
        greeting = _time_based_greeting()
        await self.session.generate_reply(instructions=f"Greet with: '{greeting}'")

async def entrypoint(ctx: JobContext) -> None:
    logger.info("FRIDAY agent online — room: %s", ctx.room.name)
    stt = build_stt()
    llm = build_llm()
    tts = build_tts()

    session = AgentSession(
        turn_detection=config.TURN_DETECTION,
        min_endpointing_delay=config.ENDPOINTING_DELAY,
    )
    await session.start(
        agent=FridayAgent(stt=stt, llm=llm, tts=tts),
        room=ctx.room,
    )

def main():
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))

def dev():
    import sys
    if len(sys.argv) == 1:
        sys.argv.append("dev")
    main()

if __name__ == "__main__":
    main()

