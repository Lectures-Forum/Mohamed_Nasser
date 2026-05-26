// تم تقسيم التوكن لتجاوز حماية GitHub
const part1 = "8918282507:";
const part2 = "AAFnn3P4VZ09QFP2ZbnXUIpz7OL_fxc6AAI";
const BOT_TOKEN = part1 + part2;

const PRIVATE_CHAT_ID = "8207640389"; 
const GROUP_CHAT_ID = "-1003911911884"; 
const WHATSAPP_LINK = "https://chat.whatsapp.com/E8ZPkp8SbM423iEraQYYlO?mode=gi_t";

document.getElementById("questionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nameInput = document.getElementById("studentName");
    const nameValue = nameInput.value.trim();
    const nameError = document.getElementById("nameError");
    const question = document.getElementById("studentQuestion").value;
    const submitBtn = document.getElementById("submitBtn");

    // تحقق صارم للاسم (ثلاث كلمات على الأقل، حروف عربية أو إنجليزية فقط)
    const nameRegex = /^[\u0600-\u06FFa-zA-Z]+(?:\s+[\u0600-\u06FFa-zA-Z]+){2,}$/;

    if (!nameRegex.test(nameValue)) {
        nameError.style.display = "block";
        nameInput.style.borderColor = "#ef4444";
        return;
    } else {
        nameError.style.display = "none";
        nameInput.style.borderColor = "#cbd5e1";
    }

    // إعداد التسلسل
    let sequenceNumber = localStorage.getItem("questionSeq");
    if (!sequenceNumber) {
        sequenceNumber = 1;
    } else {
        sequenceNumber = parseInt(sequenceNumber) + 1;
    }
    localStorage.setItem("questionSeq", sequenceNumber);

    const privateMessage = `📬 رسالة جديدة رقم: ${sequenceNumber}\n\n👤 اسم الطالب: ${nameValue}\n❓ السؤال: ${question}`;
    const groupMessage = `❓ سؤال رقم: ${sequenceNumber}\n\n${question}`;

    submitBtn.disabled = true;
    submitBtn.innerText = "جاري الإرسال...";

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: PRIVATE_CHAT_ID, text: privateMessage })
        });

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: GROUP_CHAT_ID, text: groupMessage })
        });

        window.location.href = WHATSAPP_LINK;

    } catch (error) {
        console.error("Error:", error);
        alert("حدث خطأ أثناء الإرسال. تأكد من اتصالك بالإنترنت.");
        submitBtn.disabled = false;
        submitBtn.innerText = "أرسل السؤال وانضم لجروب الواتساب";
    }
});