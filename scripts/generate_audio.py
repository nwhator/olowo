import asyncio
import os
import edge_tts

VOICE = "en-NG-AbeoNeural"
OUTPUT_DIR = os.path.join(os.getcwd(), "public", "audio")

CLIPS = {
    "welcome_pidgin.mp3": (
        "Welcome to OLOWO! Autonomous finance operator for African market women and modern business. "
        "I dey watch your money 24 7: I verify paper waybills, stop double-billing fraud, pay your suppliers sharp-sharp "
        "on Arc in digital dollars, lock your shop rent reserve, and call you before big money moves."
    ),
    "welcome_english.mp3": (
        "Welcome to OLOWO. The autonomous AI finance operator built for African market traders and modern businesses. "
        "We verify paper waybills, prevent duplicate invoice fraud, settle approved supplier payments on Arc in digital dollars, "
        "safeguard your shop rent reserve, and escalate large decisions for human sign-off."
    ),
    "briefing_pidgin.mp3": (
        "OLOWO dey watch the money! Everything dey waka normal within your rules. "
        "Your 12 thousand 400 dollars treasury dey safe, and 5 thousand dollars shop rent money dey locked. "
        "Two invoices dey wait for your approval."
    ),
    "briefing_english.mp3": (
        "OLOWO is actively watching the money. All operations are normal within your rules. "
        "Your treasury balance of 12 thousand 400 dollars is safe, with 5 thousand dollars reserved for shop rent and obligations. "
        "Two invoices await your approval."
    ),
    "rice_paid_pidgin.mp3": (
        "I don pay Alhaji Sani 480 dollars, about 720 thousand naira, for 10 bags of Mama Gold rice. "
        "Price verified, waybill correct, goods land for shop, and your 5 thousand dollars shop rent reserve complete."
    ),
    "rice_paid_english.mp3": (
        "I paid Alhaji Sani 480 dollars, about 720 thousand naira, for 10 bags of rice. "
        "The price is verified, delivery arrived at the shop, no duplicate claims exist, and treasury reserve is protected."
    ),
    "double_bill_blocked_pidgin.mp3": (
        "Warning Madam! Alhaji driver resubmit old waybill for 10 bags of rice. "
        "Double collection fraud detected. I don block am sharp-sharp!"
    ),
    "double_bill_blocked_english.mp3": (
        "Warning: Duplicate waybill detected for 10 bags of rice. "
        "Prevented double payment. Policy strictly blocked the transaction."
    ),
    "haulage_exceeded_pidgin.mp3": (
        "Madam, Cotonou haulage driver bring container invoice of 1 thousand 400 dollars, about 2 million 100 thousand naira. "
        "E pass your 1 thousand dollars limit. I no fit pay until you press Approve."
    ),
    "haulage_exceeded_english.mp3": (
        "Attention: Cotonou haulage driver submitted an invoice for 1 thousand 400 dollars, about 2 million 100 thousand naira. "
        "Deliverables are verified, but it exceeds your 1 thousand dollar authority. I require your approval before releasing funds."
    ),
    "rent_safe_pidgin.mp3": (
        "No shaking Madam! Your 5 thousand dollars shop rent reserve, about 7 point 5 million naira, "
        "dey locked and protected 100 percent. Nobody fit touch your shop money."
    ),
    "rent_safe_english.mp3": (
        "Your shop rent reserve of 5 thousand dollars, approximately 7 point 5 million naira, "
        "is strictly locked and ring-fenced. Your operating capital remains safe."
    ),
}

async def generate_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, text in CLIPS.items():
        out_path = os.path.join(OUTPUT_DIR, filename)
        print(f"Generating {filename}...")
        communicate = edge_tts.Communicate(text, VOICE, rate="-4%", pitch="-2Hz")
        await communicate.save(out_path)
        print(f"Saved {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    asyncio.run(generate_all())
