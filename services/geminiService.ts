
import { GoogleGenAI, Type } from "@google/genai";

// Strictly follow initialization guidelines using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPlayerInsights = async (playerData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك مدرب كرة قدم خبير، قم بتحليل البيانات التالية للاعب ناشئ في أكاديمية بجدة وقدم نصيحة فنية قصيرة وخطة تطوير:
      الاسم: ${playerData.name}
      الفئة: ${playerData.ageGroup}
      المهارات: مراوغة(${playerData.metrics.dribbling}/10)، تمرير(${playerData.metrics.passing}/10)، لياقة(${playerData.metrics.stamina}/10)
      
      المخرجات المطلوبة (باللغة العربية):
      1. نقاط القوة.
      2. نقاط الضعف.
      3. تمرين مقترح لتحسين الأداء.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "تعذر الحصول على التحليل الذكي حالياً.";
  }
};

export const generateTrainingPlan = async (teamInfo: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بإنشاء جدول تمارين أسبوعي مكثف لفريق كرة قدم (بنين) بجدة للفئة التالية: ${teamInfo}. ركز على الأجواء الحارة في جدة وأوقات التمارين المسائية.`,
    });
    return response.text;
  } catch (error) {
    return "تعذر إنشاء الخطة.";
  }
};
