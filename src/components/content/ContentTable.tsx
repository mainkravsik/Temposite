import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Pencil, Trash2 } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  lastModified: string;
}

interface ContentTableProps {
  items?: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const defaultItems: ContentItem[] = [
  {
    id: "1",
    title: "Welcome Post",
    type: "Blog Post",
    status: "Published",
    lastModified: "2024-03-20",
  },
  {
    id: "2",
    title: "About Us Page",
    type: "Page",
    status: "Draft",
    lastModified: "2024-03-19",
  },
  {
    id: "3",
    title: "Product Launch",
    type: "Blog Post",
    status: "Published",
    lastModified: "2024-03-18",
  },
];

const ContentTable = ({
  items = defaultItems,
  onEdit = () => {},
  onDelete = () => {},
}: ContentTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full p-4 space-y-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("published")}>
              Published
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
              Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status.toLowerCase() === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.lastModified}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentTable;
