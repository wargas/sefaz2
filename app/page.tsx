"use client"

import { FormParametros } from "@/components/form-parametros";
import { FormProventos } from "@/components/form-provento";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHook } from "@/lib/hook";
import { formatNumber } from "@/lib/utils";
import { filter, sortBy, sumBy } from "lodash";
import { PlusIcon, SlidersHorizontalIcon } from "lucide-react";
import { Fragment } from "react";

export default function Home() {
  const { changeValue, removeOutrasReceitasById, descontos, receitas, params, setOutrasReceitas } = useHook()

  const provento = (
    <FormProventos onSave={r => setOutrasReceitas(old => ([...old, { ...r, id: Math.random().toString() }]))}>
      <Button variant={'outline'} className="w-full"><PlusIcon /> provento</Button>
    </FormProventos>
  )

  return (
    <div className="flex min-h-screen font-sans">
      <aside className="hidden lg:flex flex-col w-80 shrink-0 border-r h-screen sticky top-0">
        <div className="p-4 border-b font-semibold">Parâmetros</div>
        <div className="flex-1 overflow-y-auto p-4">
          <FormParametros params={params} changeValue={changeValue} />
        </div>
        <div className="p-4 border-t">{provento}</div>
      </aside>

      <main className="flex-1 min-w-0 p-4 lg:p-8">
        <div className="lg:hidden mb-4 flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={'outline'} className="flex-1"><SlidersHorizontalIcon /> Parâmetros</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm gap-0">
              <SheetHeader className="border-b">
                <SheetTitle>Parâmetros</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4">
                <FormParametros params={params} changeValue={changeValue} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1">{provento}</div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {['remuneracao', 'indenizacao'].map(grupo => ({ grupo, items: filter(receitas, { grupo }) })).map(({ grupo, items }) => <Fragment key={`grupo-r-${grupo}`}>
                  <TableRow >
                    <TableHead>{grupo.toUpperCase()}</TableHead>
                    <TableHead className="text-end font-bold">{formatNumber(sumBy(items, "value"))}</TableHead>
                  </TableRow>
                  {sortBy(items, 'value').reverse().filter(r => r.value > 0).map(r => (
                    <TableRow key={`receitas-${r.name}`}>
                      <TableCell className="uppercase group pl-10 font-light">
                        {r.name}
                        {r.id && (
                          <span onClick={() => removeOutrasReceitasById(r.id || '')} className="ml-4 lowercase opacity-0 group-hover:opacity-100 cursor-pointer">excluir</span>
                        )}
                      </TableCell>
                      <TableCell className="text-end font-bold">{formatNumber(r.value)}</TableCell>
                    </TableRow>
                  ))}

                </Fragment>)}

                <TableRow>
                  <TableHead className="bg-accent">RECEITA BRUTA</TableHead>
                  <TableHead className="text-end font-bold bg-accent">{formatNumber(sumBy(receitas, 'value'))}</TableHead>
                </TableRow>
                <TableRow>
                  <TableCell className="border-none"></TableCell>
                </TableRow>

                {['previdencia','outros'].map(grupo => ({ grupo, items: filter(descontos, { grupo }) })).map(({ grupo, items }) => <Fragment key={`grupo-d-${grupo}`} >
                  <TableRow>
                    <TableHead>{grupo.toUpperCase()}</TableHead>
                    <TableHead className="text-end font-bold">{formatNumber(sumBy(items, "value"))}</TableHead>
                  </TableRow>
                  {sortBy(items, 'value').reverse().filter(r => r.value > 0).map(r => (
                    <TableRow key={`descontos-${r.name}`}>
                      <TableCell className="uppercase group pl-10 font-light">
                        {r.name}
                       
                      </TableCell>
                      <TableCell className="text-end font-bold">{formatNumber(r.value)}</TableCell>
                    </TableRow>
                  ))}

                </Fragment>)}
                {/* {sortBy(descontos, 'value').filter(d => d.value > 0).reverse().map(d => (
                  <TableRow>
                    <TableCell className="uppercase pl-10 font-light">{d.name}</TableCell>
                    <TableCell className="text-end font-bold">{formatNumber(d.value)}</TableCell>
                  </TableRow>
                ))} */}
                <TableRow>
                  <TableHead className="bg-accent">DESCONTOS</TableHead>
                  <TableHead className="text-end font-bold bg-accent">{formatNumber(sumBy(descontos, 'value'))}</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="bg-accent">LIQUIDO</TableHead>
                  <TableHead className="text-end font-bold bg-accent">{formatNumber(sumBy(receitas, 'value') - sumBy(descontos, 'value'))}</TableHead>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
