import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { addStudent, listStudents } from "../api/admin";
import { IconCopy, IconEye } from "../assets/icons";
import Loader from "../components/loader";
import { toast } from "sonner";

const ManageStudents = () => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
        <AddStudentModal />
      </div>
      <ListStudents />
    </div>
  );
};

export default ManageStudents;

const AddStudentModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [addedStudent, setAddedStudent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const addStudentMutation = useMutation({
    mutationFn: addStudent,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(result.message);
      setAddedStudent(result.student);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleModalClose = () => {
    // Resetting state when modal closes
    setAddedStudent(null);
    setName("");
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

  const handleAddStudent = () => {
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter valid email address");
    }

    addStudentMutation.mutate({ name, email, password });
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Add Student
      </Button>
      <Modal isOpen={isOpen} onOpenChange={handleModalClose} backdrop="opaque">
        {addedStudent ? (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Student Added Successfully
                </ModalHeader>
                <ModalBody>
                  <p className="mb-2">
                    Share these credentials with the student to login
                  </p>
                  <Input
                    labelPlacement="outside"
                    label="Email"
                    placeholder="Enter student's email"
                    variant="bordered"
                    endContent={
                      <span
                        className="text-2xl text-default-400 cursor-pointer flex-shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(addedStudent.email);
                          toast.success("Copied to clipboard");
                        }}
                      >
                        <IconCopy />
                      </span>
                    }
                    disabled
                    value={addedStudent.email}
                  />
                  <Input
                    labelPlacement="outside"
                    label="Password"
                    placeholder="Enter password"
                    variant="bordered"
                    endContent={
                      <span
                        className="text-2xl text-default-400 cursor-pointer flex-shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(addedStudent.password);
                          toast.success("Copied to clipboard");
                        }}
                      >
                        <IconCopy />
                      </span>
                    }
                    disabled
                    value={addedStudent.password}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Ok
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        ) : (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add Student
                </ModalHeader>
                <ModalBody>
                  <Input
                    labelPlacement="outside"
                    autoFocus
                    label="Name"
                    placeholder="Enter student's name"
                    variant="bordered"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    labelPlacement="outside"
                    label="Email"
                    placeholder="Enter student's email"
                    variant="bordered"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    labelPlacement="outside"
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                    variant="bordered"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    isLoading={addStudentMutation.isPending}
                    color="primary"
                    onPress={handleAddStudent}
                  >
                    Add Student
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

const columns = [
  { uid: "id", name: "ID" },
  { uid: "name", name: "Name" },
  { uid: "email", name: "Email" },
  { uid: "graduationYear", name: "Graduation Year" },
  { uid: "actions", name: "Actions" },
];

const ListStudents = () => {
  const { data: students, isPending } = useQuery({
    queryFn: listStudents,
    queryKey: ["students"],
  });

  const renderCell = useCallback((student, columnKey) => {
    const cellValue = student[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip content="Details">
              <Link to={`/dashboard/manage-students/${student.id}`}>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <IconEye />
                </span>
              </Link>
            </Tooltip>
          </div>
        );
      case "graduationYear":
        return student.graduationYear || "N/A";
      default:
        return cellValue;
    }
  }, []);

  if (isPending) {
    return <Loader />;
  }

  return (
    <Table isStriped aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={students}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
