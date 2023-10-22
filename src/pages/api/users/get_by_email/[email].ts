import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { fauna } from "../../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const email = req.query.email as string;
    console.log("EMAIL: ", email);

    if (!email) {
      return res.status(400).json({ error: "Invalid email parameter" });
    }
    try {
      const query = await fauna.query(
        q.Select("active", q.Get(q.Index("user_by_email")))
      );
      console.log("query: ", query);
      res.status(200).json({ data: query });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while querying FaunaDB" });
    }
  }
};
