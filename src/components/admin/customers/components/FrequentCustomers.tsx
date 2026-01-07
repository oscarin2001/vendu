"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Crown, Star, Search, Users, UserCheck, UserX } from "lucide-react";
import { CustomerBehavior } from "@/services/admin/customers/types";

interface FrequentCustomersProps {
  customers: CustomerBehavior[];
  isLoading: boolean;
  onViewCustomer: (customer: CustomerBehavior) => void;
}

export function FrequentCustomers({
  customers,
  isLoading,
  onViewCustomer,
}: FrequentCustomersProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState("all");

  const getLoyaltyBadgeVariant = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "default";
      case "gold":
        return "secondary";
      case "silver":
        return "outline";
      case "bronze":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getLoyaltyTierName = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "Platino";
      case "gold":
        return "Oro";
      case "silver":
        return "Plata";
      case "bronze":
        return "Bronce";
      default:
        return tier;
    }
  };

  const getAvatarColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-500";
      case "gold":
        return "bg-yellow-500";
      case "silver":
        return "bg-gray-500";
      case "bronze":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (
      selectedSegment === "loyal" &&
      customer.loyaltyTier !== "platinum" &&
      customer.loyaltyTier !== "gold"
    )
      return false;
    if (selectedSegment === "new" && customer.totalOrders < 5) return false;
    if (
      selectedSegment === "inactive" &&
      customer.lastOrderDate > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    )
      return false;
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes Frecuentes</CardTitle>
          <CardDescription>
            Gestión de clientes VIP y segmentación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Clientes Frecuentes
        </h2>
        <p className="text-muted-foreground">
          Gestión y segmentación de clientes por lealtad y comportamiento
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Toggle Group for Segments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Segmentos</label>
              <ToggleGroup
                type="single"
                value={selectedSegment}
                onValueChange={(value) => value && setSelectedSegment(value)}
              >
                <ToggleGroupItem value="all" aria-label="Todos">
                  <Users className="h-4 w-4 mr-2" />
                  Todos
                </ToggleGroupItem>
                <ToggleGroupItem value="loyal" aria-label="Leales">
                  <Crown className="h-4 w-4 mr-2" />
                  VIP
                </ToggleGroupItem>
                <ToggleGroupItem value="new" aria-label="Nuevos">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Nuevos
                </ToggleGroupItem>
                <ToggleGroupItem value="inactive" aria-label="Inactivos">
                  <UserX className="h-4 w-4 mr-2" />
                  Inactivos
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Command Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Búsqueda Global</label>
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-64 justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar clientes...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <Command>
                    <CommandInput placeholder="Buscar por ID o nombre..." />
                    <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {customers.slice(0, 10).map((customer) => (
                          <CommandItem
                            key={customer.id}
                            onSelect={() => {
                              onViewCustomer(customer);
                              setSearchOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback
                                  className={`text-xs text-white ${getAvatarColor(
                                    customer.loyaltyTier
                                  )}`}
                                >
                                  {customer.customerId.slice(-2)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{customer.customerId}</span>
                              <Badge
                                variant={getLoyaltyBadgeVariant(
                                  customer.loyaltyTier
                                )}
                                className="ml-auto"
                              >
                                {getLoyaltyTierName(customer.loyaltyTier)}
                              </Badge>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback
                    className={`text-white font-semibold ${getAvatarColor(
                      customer.loyaltyTier
                    )}`}
                  >
                    {customer.customerId.slice(-2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">
                    {customer.customerId}
                  </CardTitle>
                  <Badge variant={getLoyaltyBadgeVariant(customer.loyaltyTier)}>
                    <Crown className="w-3 h-3 mr-1" />
                    {getLoyaltyTierName(customer.loyaltyTier)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Órdenes</p>
                  <p className="font-semibold">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gasto Total</p>
                  <p className="font-semibold">
                    ${customer.totalSpent.toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {customer.pointsBalance} puntos
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewCustomer(customer)}
                >
                  Ver detalles
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Última orden: {customer.lastOrderDate.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {customers.filter((c) => c.loyaltyTier === "platinum").length}
              </div>
              <div className="text-sm text-muted-foreground">
                Clientes Platino
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {customers.filter((c) => c.loyaltyTier === "gold").length}
              </div>
              <div className="text-sm text-muted-foreground">Clientes Oro</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {customers.filter((c) => c.totalOrders < 5).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Clientes Nuevos
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  customers.filter(
                    (c) =>
                      c.lastOrderDate <
                      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Clientes Inactivos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
