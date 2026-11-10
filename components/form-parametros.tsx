"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { config } from "@/lib/config";
import { useHook } from "@/lib/hook";

type Props = Pick<ReturnType<typeof useHook>, "params" | "changeValue">

const labelClass = "line-clamp-1 flex justify-between gap-2 mb-1"
const actionClass = "cursor-pointer text-xs text-muted-foreground hover:text-foreground"

export function FormParametros({ params, changeValue }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1">
        <Label className={labelClass}>Ano</Label>
        <Select value={params.ano} onValueChange={(v: any) => changeValue({ ano: v })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1">
        <Label className={labelClass}>Referência</Label>
        <Select value={params.nivel} onValueChange={(v: any) => changeValue({ nivel: v })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Referência" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(config.tabela[2023]).map(n => (
              <SelectItem key={n} value={n}>
                {n.padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1">
        <Label className={labelClass}>Região Fiscal</Label>
        <Select value={params.regiao_fiscal} onValueChange={(v: any) => changeValue({ regiao_fiscal: v })}>
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
        <Label className={labelClass}>
          Dependentes IR
          {params.dependentesIR > 0 && <span className={actionClass} onClick={() => changeValue({ dependentesIR: 0 })}>limpar</span>}
        </Label>
        <Input min={0} type="number" value={params.dependentesIR.toString()} onChange={ev => changeValue({ dependentesIR: parseInt(ev.target.value || '0') })} />
      </div>

      <div className="col-span-1">
        <Label className={labelClass}>
          <span className="mr-auto">% GOATE</span>
          <DropdownMenu>
            <DropdownMenuTrigger className={actionClass}>Opções</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeValue({ grg: 36 })}>36% (min)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeValue({ grg: 56 })}>56% (max)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Label>
        <Input
          value={(params.grg).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          onChange={ev => changeValue({ grg: parseFloat(ev.target.value.replaceAll('.', '').replaceAll(',', '') || '0') / 10 })} />
      </div>

      <div className="col-span-1">
        <Label className={labelClass}>Quinquênios</Label>
        <Input min={0} type="number" value={params.quinquenios.toString()} onChange={ev => changeValue({ quinquenios: parseInt(ev.target.value || '0') })} />
      </div>

      <div className="col-span-2">
        <Label className={labelClass}>
          <span className="mr-auto">FAAF</span>
          <DropdownMenu>
            <DropdownMenuTrigger className={actionClass}>Opções</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeValue({ faaf: 5700 })}>5.700,00</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeValue({ faaf: 6500 })}>6.500,00</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeValue({ faaf: 9500 })}>9.500,00</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {params.faaf > 0 && <span className={actionClass} onClick={() => changeValue({ faaf: 0 })}>limpar</span>}
        </Label>
        <Input
          value={(params.faaf).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          onChange={ev => changeValue({ faaf: parseFloat(ev.target.value.replaceAll('.', '').replace(',', '') || '0') / 100 })} />
      </div>

      <div className="col-span-2">
        <Label className={labelClass}>
          <span className="mr-auto">Teto</span>
          <DropdownMenu>
            <DropdownMenuTrigger className={actionClass}>Opções</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeValue({ teto: config.tetoSTF })}>MIN. STF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeValue({ teto: config.tetoSTF * 0.9025 })}>DES. TJ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Label>
        <Input
          value={(params.teto).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          onChange={ev => changeValue({ teto: parseFloat(ev.target.value.replaceAll('.', '').replace(',', '') || '0') / 100 })} />
      </div>

      <div className="col-span-2">
        <Label className={labelClass}>
          <span>Consignados</span>
          {params.consignado > 0 && <span className={actionClass} onClick={() => changeValue({ consignado: 0 })}>limpar</span>}
        </Label>
        <Input
          value={(params.consignado).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          onChange={ev => changeValue({ consignado: parseFloat(ev.target.value.replaceAll('.', '').replace(',', '') || '0') / 100 })}
        />
      </div>

      <div className="col-span-1">
        <Label className={labelClass}>
          <span>Dias Trab.</span>
          {params.diasTrabalhados > 0 && <span className={actionClass} onClick={() => changeValue({ diasTrabalhados: 30 })}>30 dias</span>}
        </Label>
        <Input
          value={params.diasTrabalhados}
          onChange={ev => changeValue({ diasTrabalhados: parseInt(ev.target.value || '0') || 0 })}
        />
      </div>

      <div className="col-span-1">
        <Label className={labelClass}>Em abono</Label>
        <Select value={params.abonoPermanencia ? "S" : "N"} onValueChange={(v: any) => changeValue({ abonoPermanencia: v == "S" })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Em abono" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="S">Sim</SelectItem>
            <SelectItem value="N">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2">
        <Label className={labelClass}>Regime Previdência</Label>
        <Select value={params.regime_tributario} onValueChange={(v: any) => changeValue({ regime_tributario: String(v) })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Regime" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">FUNAPREV</SelectItem>
            <SelectItem value="2">FUNAFIN</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2">
        <Label className={labelClass}>
          <span className="mr-auto">Alíquota Complementar</span>
          <span className={actionClass} onClick={() => changeValue({ complementar: 0 })}>0,00</span>
          <span className={actionClass} onClick={() => changeValue({ complementar: 8.5 })}>8,50</span>
        </Label>
        <Input
          value={(params.complementar).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          onChange={ev => changeValue({ complementar: parseFloat(ev.target.value.replaceAll('.', '').replace(',', '') || '0') / 100 })} />
      </div>
    </div>
  )
}
