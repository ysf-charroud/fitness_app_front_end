// components/admin/dashboard/DashboardContent.jsx
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";

export default function DashboardContent() {
  const { lastTransactions, bestPrograms } = useSelector((state) => state.admin);
  
  // Limiter à 3 transactions seulement
  const displayedTransactions = lastTransactions?.slice(0, 3) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Last Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Last Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Athlete</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((t, i) => (
                  <TableRow 
                    key={t._id || i}
                    className="h-16 transition-all duration-300 ease-in-out hover:bg-orange-50 hover:shadow-md hover:scale-[1.02] cursor-pointer border-b"
                  >
                    <TableCell className="font-medium py-4">{t.athlete}</TableCell>
                    <TableCell className="py-4">{t.program}</TableCell>
                    <TableCell className="font-semibold py-4 text-orange-600">{t.price} MAD</TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {new Date(t.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Aucune transaction disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Bouton Voir Plus */}
          {displayedTransactions.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Link to="/admin/transactions">
                <Button variant="outline" className="gap-2">
                  Voir plus
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Best Programs */}
       <Card>
        <CardHeader>
          <CardTitle>Best Programs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bestPrograms?.map((p, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ease-in-out
                ${i === 0 ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" :
                  i === 1 ? "bg-gray-50 border-gray-200 hover:bg-gray-100" :
                  i === 2 ? "bg-orange-50 border-orange-200 hover:bg-orange-100" :
                  "bg-white border-gray-200 hover:bg-gray-50"
                }
                hover:scale-105 hover:shadow-md cursor-pointer`}
            >
              {/* 🥇 Médaille + Avatar */}
              <div className="flex items-center gap-3">
                {/* Médaille */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {i === 0 && (
                    <span className="text-yellow-600 text-xl">🥇</span>
                  )}
                  {i === 1 && (
                    <span className="text-gray-600 text-xl">🥈</span>
                  )}
                  {i === 2 && (
                    <span className="text-orange-600 text-xl">🥉</span>
                  )}
                  {i >= 3 && (
                    <span className="text-gray-400 text-sm">{i + 1}</span>
                  )}
                </div>

                {/* Avatar + Nom du programme + Coach */}
                <div>
                  <p className="font-medium">{p.title}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>by {p.creator}</span>
                  </div>
                </div>
              </div>

              {/* 💰 Sales */}
              <span className="text-sm font-semibold">{p.sales} sales</span>
            </div>
          )) || <p className="text-muted-foreground">No programs</p>}
        </CardContent>
      </Card>

    </div>
  )}
