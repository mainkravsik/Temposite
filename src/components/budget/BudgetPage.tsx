import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  date: string;
  person: string;
  category: string;
  amount: number;
  description: string;
  type: "expense" | "income";
}

import { useAuth } from "@/contexts/AuthContext";

export default function BudgetPage() {
  const navigate = useNavigate();
  const { user, family } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-02-11",
      person: "Алёна",
      category: "Форс-мажор",
      amount: -25000,
      description: "Убрал в накопления",
      type: "expense",
    },
    {
      id: "2",
      date: "2024-02-11",
      person: "Илья",
      category: "Еда",
      amount: -1687.14,
      description: "Кушать взяли понемножку",
      type: "expense",
    },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    person: "Общие",
    amount: "",
    category: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const ilyaBalance = transactions
    .filter((t) => t.person === "Илья")
    .reduce((sum, t) => sum + t.amount, 14232.2);
  const alenaBalance = transactions
    .filter((t) => t.person === "Алёна")
    .reduce((sum, t) => sum + t.amount, 19112.87);
  const commonExpenses = transactions
    .filter((t) => t.person === "Общие")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount =
      newTransaction.type === "expense"
        ? -Math.abs(Number(newTransaction.amount))
        : Math.abs(Number(newTransaction.amount));

    setTransactions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        date: newTransaction.date,
        person: newTransaction.person,
        category: newTransaction.category,
        amount: amount,
        description: newTransaction.description,
        type: newTransaction.type as "expense" | "income",
      },
    ]);

    setNewTransaction({
      type: "expense",
      person: "Общие",
      amount: "",
      category: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Семейный бюджет</h1>
          {family && (
            <p className="text-sm text-muted-foreground">
              Семья: {family.name}
            </p>
          )}
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Админ панель
          </Button>
          <Button variant="outline">Экспорт в CSV</Button>
        </div>
      </div>

      <Card className="p-6 bg-slate-800 text-white">
        <h2 className="text-lg font-semibold mb-2">СКОКА ДЕНЕГ</h2>
        <div className="text-3xl font-bold">{totalBalance.toFixed(2)} ₽</div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-1">Баланс Ильи</h3>
          <div className="text-2xl font-bold">{ilyaBalance.toFixed(2)} ₽</div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-1">Баланс Алёны</h3>
          <div className="text-2xl font-bold">{alenaBalance.toFixed(2)} ₽</div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium mb-1">Общие расходы</h3>
          <div className="text-2xl font-bold">
            {commonExpenses.toFixed(2)} ₽
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={newTransaction.type}
              onValueChange={(value) =>
                setNewTransaction((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Расход</SelectItem>
                <SelectItem value="income">Доход</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newTransaction.person}
              onValueChange={(value) =>
                setNewTransaction((prev) => ({ ...prev, person: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите персону" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Илья">Илья</SelectItem>
                <SelectItem value="Алёна">Алёна</SelectItem>
                <SelectItem value="Общие">Общие</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Сумма"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
            />

            <Select
              value={newTransaction.category}
              onValueChange={(value) =>
                setNewTransaction((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Еда">Еда</SelectItem>
                <SelectItem value="Форс-мажор">Форс-мажор</SelectItem>
                <SelectItem value="Домашние нужды">Домашние нужды</SelectItem>
                <SelectItem value="Котики">Котики</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Описание"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Добавить
          </Button>
        </form>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">История транзакций</h2>
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-slate-100 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {format(new Date(transaction.date), "dd.MM.yyyy")}
                </div>
                <div className="font-medium">{transaction.person}</div>
                <div className="text-gray-600">{transaction.category}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div
                  className={`font-bold ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}
                >
                  {transaction.amount.toFixed(2)} ₽
                </div>
                <div className="text-sm text-gray-600">
                  {transaction.description}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    setTransactions((prev) =>
                      prev.filter((t) => t.id !== transaction.id),
                    )
                  }
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
