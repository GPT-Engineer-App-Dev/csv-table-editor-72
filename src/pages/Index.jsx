import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAnimals, useAddAnimal, useUpdateAnimal, useDeleteAnimal } from "@/integrations/supabase/index.js";

function Index() {
  const { data: animals, isLoading, error } = useAnimals();
  const addAnimal = useAddAnimal();
  const updateAnimal = useUpdateAnimal();
  const deleteAnimal = useDeleteAnimal();

  const [newAnimal, setNewAnimal] = useState({ name: "", species: "", image_url: "" });

  const handleAddAnimal = () => {
    addAnimal.mutate(newAnimal, {
      onSuccess: () => {
        toast("Animal added successfully!");
        setNewAnimal({ name: "", species: "", image_url: "" });
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  const handleUpdateAnimal = (id, updatedAnimal) => {
    updateAnimal.mutate({ id, ...updatedAnimal }, {
      onSuccess: () => {
        toast("Animal updated successfully!");
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  const handleDeleteAnimal = (id) => {
    deleteAnimal.mutate(id, {
      onSuccess: () => {
        toast("Animal deleted successfully!");
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col items-center gap-4">
        <Input
          placeholder="Name"
          value={newAnimal.name}
          onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
        />
        <Input
          placeholder="Species"
          value={newAnimal.species}
          onChange={(e) => setNewAnimal({ ...newAnimal, species: e.target.value })}
        />
        <Input
          placeholder="Image URL"
          value={newAnimal.image_url}
          onChange={(e) => setNewAnimal({ ...newAnimal, image_url: e.target.value })}
        />
        <Button onClick={handleAddAnimal}>Add Animal</Button>
      </div>
      {animals.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animals.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell>
                  <Input
                    value={animal.name}
                    onChange={(e) => handleUpdateAnimal(animal.id, { ...animal, name: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={animal.species}
                    onChange={(e) => handleUpdateAnimal(animal.id, { ...animal, species: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={animal.image_url}
                    onChange={(e) => handleUpdateAnimal(animal.id, { ...animal, image_url: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteAnimal(animal.id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}

export default Index;