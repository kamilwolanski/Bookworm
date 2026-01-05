/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookTabsClient({
  editionId,
  description,
  otherEditions,
}: {
  editionId: string;
  description: React.ReactNode;
  otherEditions: React.ReactNode;
}) {
  const [value, setValue] = useState(() => "description");
  useEffect(() => {
    setValue("description");
  }, [editionId]);

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        <TabsTrigger value="description">Opis</TabsTrigger>
        <TabsTrigger value="otherEditions">Inne wydania</TabsTrigger>
      </TabsList>

      <TabsContent value="description">{description}</TabsContent>

      <TabsContent value="otherEditions">{otherEditions}</TabsContent>
    </Tabs>
  );
}
