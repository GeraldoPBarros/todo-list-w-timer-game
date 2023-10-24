import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import React from "react";

interface HistoryCardProps {
  title: string;
  value: string;
  margin?: string;
}

export function HistoryCard({
  title,
  value,
  margin = "0px",
}: HistoryCardProps) {
  return (
    <Card mt="30px" ml={margin}>
      <CardHeader fontWeight="bold">{title}</CardHeader>
      <CardBody fontSize="xl">{value}</CardBody>
    </Card>
  );
}
