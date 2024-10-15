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
import { addCompany, listCompanies } from "../api/admin";
import { IconCopy, IconEye } from "../assets/icons";
import Loader from "../components/loader";
import { toast } from "sonner";

const ManageCompanies = () => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Manage Companies</h1>
        <AddCompanyModal />
      </div>
      <ListCompanies />
    </div>
  );
};

export default ManageCompanies;

const AddCompanyModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [addedCompany, setAddedCompany] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const addCompanyMutation = useMutation({
    mutationFn: addCompany,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success(result.message);
      setAddedCompany(result.company);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleModalClose = () => {
    // Resetting state when modal closes
    setAddedCompany(null);
    setName("");
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

  const handleAddCompany = () => {
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter valid email address");
    }

    addCompanyMutation.mutate({ name, email, password });
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Add Company
      </Button>
      <Modal isOpen={isOpen} onOpenChange={handleModalClose} backdrop="opaque">
        {addedCompany ? (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Company Added Successfully
                </ModalHeader>
                <ModalBody>
                  <p className="mb-2">
                    Share these credentials with the company to login
                  </p>
                  <Input
                    labelPlacement="outside"
                    label="Email"
                    placeholder="Enter company's email"
                    variant="bordered"
                    endContent={
                      <span
                        className="text-2xl text-default-400 cursor-pointer flex-shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(addedCompany.email);
                          toast.success("Copied to clipboard");
                        }}
                      >
                        <IconCopy />
                      </span>
                    }
                    disabled
                    value={addedCompany.email}
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
                          navigator.clipboard.writeText(addedCompany.password);
                          toast.success("Copied to clipboard");
                        }}
                      >
                        <IconCopy />
                      </span>
                    }
                    disabled
                    value={addedCompany.password}
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
                  Add Company
                </ModalHeader>
                <ModalBody>
                  <Input
                    labelPlacement="outside"
                    autoFocus
                    label="Name"
                    placeholder="Enter company's name"
                    variant="bordered"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    labelPlacement="outside"
                    label="Email"
                    placeholder="Enter company's email"
                    variant="bordered"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    labelPlacement="outside"
                    label="Password"
                    placeholder="Enter password"
                    variant="bordered"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    isLoading={addCompanyMutation.isPending}
                    color="primary"
                    onPress={handleAddCompany}
                  >
                    Add Company
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
  { uid: "actions", name: "Actions" },
];

const ListCompanies = () => {
  const { data: companies, isPending } = useQuery({
    queryFn: listCompanies,
    queryKey: ["companies"],
  });

  const renderCell = useCallback((company, columnKey) => {
    const cellValue = company[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip content="Details">
              <Link to={`/dashboard/manage-companies/${company.id}`}>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <IconEye />
                </span>
              </Link>
            </Tooltip>
          </div>
        );
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
      <TableBody items={companies}>
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
