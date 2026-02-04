"use client"

import { FormProventos } from "@/components/form-provento";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { config } from "@/lib/config";
import { useHook } from "@/lib/hook";
import { cn, formatNumber } from "@/lib/utils";
import { sortBy, sumBy } from "lodash";
import { EyeIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showMenu, setShowMenu] = useState(true)
  const { changeValue, removeOutrasReceitasById, descontos, bcIR, bcPrevidencia, bcSaude, receitas, params, setParams, outrasReceitas, setOutrasReceitas } = useHook()

  return (
    <div className="flex flex-col mx-auto container p-4 gap-4">

      <div className="font-sans container mt-4 mx-auto">
        <Card>
          <CardHeader>
            <div className={cn({ "grid": showMenu, "hidden": !showMenu }, "transition-all grid-cols-2 lg:grid-cols-7 gap-4")}>
              <div className="col-span-1">
                <Label className="line-clamp-1 flex justify-between" title="Dependentes IR" htmlFor="">ANO</Label>
                <Select value={params.ano} onValueChange={(v:any) => changeValue({ ano: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Titulação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label className="line-clamp-1 flex justify-between" title="Dependentes IR" htmlFor="">Referência</Label>
                <Select value={params.nivel} onValueChange={(v:any) => changeValue({ nivel: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Referência" />
                  </SelectTrigger>
                  <SelectContent>
                    <div>
                      {Object.keys(config.tabela[2023]).map(n => (
                        <SelectItem key={n} value={n}>
                          {n.padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label className="line-clamp-1 flex justify-between" title="Dependentes IR" htmlFor="">Região Fiscal</Label>
                <Select value={params.regiao_fiscal} onValueChange={(v:any) => changeValue({ regiao_fiscal: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Região Fiscal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label className="line-clamp-1 flex justify-between" title="Dependentes IR" htmlFor="">
                  Dependentes IR
                  {params.dependentesIR > 0 && <span className="" onClick={() => changeValue({ dependentesIR: 0 })}>limpar</span>}
                </Label>
                <Input min={0} type="number" value={params.dependentesIR.toString()} onChange={ev => changeValue({ dependentesIR: parseInt(ev.target.value || '0') })} />
              </div>

              <div className="col-span-1">
                <Label className="line-clamp-1 justify-between flex" title="FIDAF" htmlFor="">
                  <span className="mr-auto">FAAF</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      Opções
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => changeValue({ faaf: 5700 })}>5.700,00</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeValue({ faaf: 6500 })}>6.500,00</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeValue({ faaf: 9500 })}>9.500,00</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {params.faaf > 0 && <span className="" onClick={() => changeValue({ faaf: 0 })}>limpar</span>}
                </Label>
                <Input
                  value={(params.faaf).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                  onChange={ev => changeValue({ faaf: parseFloat(ev.target.value.replaceAll('.', '').replace(',', '') || '0') / 100 })} />
              </div>

              <div className="col-span-1">
                <Label className="line-clamp-1 justify-between flex" title="FIDAF" htmlFor="">
                  <span className="mr-auto">% GOATE</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      Opções
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => changeValue({ grg: 36 })}>36% (min)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeValue({ grg: 56 })}>56% (max)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Label>
                <Input
                  value={(params.grg).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}
                  onChange={ev => changeValue({ grg: parseFloat(ev.target.value.replaceAll('.', '').replaceAll(',', '') || '0')/10 })} />
              </div>
             
            
              
              <div className="col-span-1">
                <Label className="line-clamp-1 justify-between flex" title="Ajuste" htmlFor="">
                  <span>Consignados</span>
                  {params.consignado > 0 && <span className="" onClick={() => changeValue({ consignado: 0 })}>limpar</span>}
                </Label>
                <Input
                  value={(params.consignado).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                  onChange={ev => changeValue({ consignado: parseFloat(ev.target.value.replaceAll('.', '').replace(',', '') || '0') / 100 })}
                />
              </div>
            </div>
            <div className="mt-2 flex gap-2 justify-end">
              {/* <Button onClick={() => setShowMenu(!showMenu)}>
                <EyeIcon />
              </Button> */}
              <div className="col-span-1">
                <Label className="line-clamp-1 justify-between flex" title="Ajuste" htmlFor="">
                  <span>Dias Trabalhados</span>
                  {params.diasTrabalhados > 0 && <span className="" onClick={() => changeValue({ diasTrabalhados: 30 })}>30 dias</span>}
                </Label>
                <Input
                  value={params.diasTrabalhados}
                  onChange={ev => changeValue({ diasTrabalhados: parseInt(ev.target.value||'0')||0})}
                />
              </div>
              <div className="col-span-1">
                <Label className="line-clamp-1 justify-between flex" title="Ajuste" htmlFor="">
                  <span>Regime Previdência</span>
                </Label>
                 <Select value={params.regime_tributario} onValueChange={(v:any) => changeValue({ regime_tributario: String(v) })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Região Fiscal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Com Complementar</SelectItem>
                    <SelectItem value="2">Sem Complementar + Teto INSS</SelectItem>
                    <SelectItem value="3">Sem Complementar</SelectItem>
                  </SelectContent>
                </Select>
                
              </div>
              <div className="ml-auto"></div>
              <FormProventos onSave={r => setOutrasReceitas(old => ([...old, { ...r, id: Math.random().toString() }]))}>
                <Button variant={'outline'}><PlusIcon /> provento</Button>
              </FormProventos>
            </div>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <Table>
              <TableBody>
                {sortBy(receitas, 'value').reverse().filter(r => r.value > 0).map(r => (
                  <TableRow key={r.name}>
                    <TableCell className="uppercase group pl-10 font-light">
                      {r.name}
                      {r.id && (
                        <span onClick={() => removeOutrasReceitasById(r.id || '')} className="ml-4 lowercase opacity-0 group-hover:opacity-100 cursor-pointer">excluir</span>
                      )}
                    </TableCell>
                    <TableCell className="text-end font-bold">{formatNumber(r.value)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableHead className="bg-accent">Receita bruta</TableHead>
                  <TableHead className="text-end font-bold bg-accent">{formatNumber(sumBy(receitas, 'value'))}</TableHead>
                </TableRow>
                {sortBy(descontos, 'value').filter(d => d.value > 0).reverse().map(d => (
                  <TableRow>
                    <TableCell className="uppercase pl-10 font-light">{d.name}</TableCell>
                    <TableCell className="text-end font-bold">{formatNumber(d.value)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableHead className="bg-accent">Descontos</TableHead>
                  <TableHead className="text-end font-bold bg-accent">{formatNumber(sumBy(descontos, 'value'))}</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="bg-accent">Líquido</TableHead>
                  <TableHead className="text-end font-bold bg-accent">{formatNumber(sumBy(receitas, 'value') - sumBy(descontos, 'value'))}</TableHead>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
