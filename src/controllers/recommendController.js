import { recommendRecipes } from "../utils/recommendRecipes.js";

export const recommend = async (req, res) => {
  try {
    const { ingredients, preference } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "ingredients must be an array" });
    }

    if (!preference) {
      return res.status(400).json({ message: "preference required" });
    }

    const result = recommendRecipes(ingredients, preference);

    res.json(result);

  } catch (error) {
    console.error("recommend error:", error);
    res.status(500).json({ message: "server error" });
  }
};
