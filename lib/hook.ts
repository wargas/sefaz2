import { config } from "@/lib/config";
import { Receita } from "@/types";
import { filter, sumBy } from "lodash";
import { useCallback, useMemo, useState } from "react";



export function useHook() {
    const [outrasReceitas, setOutrasReceitas] = useState<Receita[]>([])

    const [params, setParams] = useState({
        grg: 56.0, 
        ano: "2024",
        regiao_fiscal: 'I',
        faaf: 5700,
        dependentesIR: 0,
        nivel: '1',
        dependentesSF: 0,
        gdf: 100,
        ita: 0.15,
        complementar: 8.5,
        sindicato: 0,
        cargo: 'AUDITOR',
        fidaf: 0,
        rav: 0,
        saude: true,
        teto: false,
        ajuste: 0,
        consignado: 0
    })

    const receitas = useMemo(() => {

        
        const ano = params.ano as "2024";

        const nivel = params.nivel as "1"

        const vencimento = config.tabela[ano][nivel]

                
        const regiao_fiscal = params.regiao_fiscal as "I"

        return [
            {
                name: 'vencimento',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: vencimento
            },
            {
                name: 'GRG - Gratificação por Resultado GOATE',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: vencimento * params.grg / 100
            },
            {
                name: 'GOF - Gratificação por Operação Fiscal',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: vencimento * config.regioes_fiscais[regiao_fiscal]
            },
            {
                name: 'GRV - Gratificação por Risco de Vida',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: vencimento * 0.05
            },
            {
                name: 'FAAF',
                ir: false,
                saude: false,
                previdencia: false,
                teto: true,
                value: params.faaf
            },
            ...outrasReceitas
        ]
    }, [params, config, outrasReceitas])

    const bcSaude = useMemo(() => {
        let geral_teto = sumBy(filter(receitas, { saude: true, teto: true }), 'value')
        let geral_no_teto = sumBy(filter(receitas, { saude: true, teto: false }), 'value')

        if (geral_teto > config.remuneracaoGovernador && params.teto) {
            geral_teto = config.remuneracaoGovernador
        }

        return geral_teto + geral_no_teto;
    }, [receitas])

    const bcPrevidencia = useMemo(() => {
        let geral_teto = sumBy(filter(receitas, { previdencia: true, teto: true }), 'value')
        let geral_no_teto = sumBy(filter(receitas, { previdencia: true, teto: false }), 'value')

        if (geral_teto > config.remuneracaoGovernador && params.teto) {
            geral_teto = config.remuneracaoGovernador
        }

        const geral = geral_teto + geral_no_teto;

        const bcPrevifor = config.tetoINSS;
        const bcComplementar = geral - bcPrevifor

        return {
            previdor: bcPrevifor,
            complementar: bcComplementar
        }

    }, [receitas])

    const bcIR = useMemo(() => {
        const descontoDependente = params.dependentesIR * 189.59

        let ir_teto = sumBy(filter(receitas, { ir: true, teto: true }), 'value')
        const ir_no_teto = sumBy(filter(receitas, { ir: true, teto: false }), 'value')

        if (ir_teto > config.remuneracaoGovernador && params.teto) {
            ir_teto = config.remuneracaoGovernador
        }

        return ir_teto + ir_no_teto - descontoDependente
    }, [receitas, params])

    const descontos = useMemo(() => {

        const valorFunape = bcPrevidencia.previdor * 0.14
        const valorPrevComplementar = bcPrevidencia.complementar * (params.complementar / 100)

        const bcIR2 = bcIR - valorFunape - valorPrevComplementar;

        const valorIR = bcIR2 * 0.275 - 896

        const receitasTeto = sumBy(filter(receitas, { teto: true }), 'value')

        const descontoTeto = (config.remuneracaoGovernador < receitasTeto && params.teto) ? receitasTeto - config.remuneracaoGovernador : 0

        return [
            // { name: 'saude', value: params.saude ? bcSaude * 0.02 : 0 },
            { name: 'previfor', value: valorFunape },
            { name: 'Prev Complementar', value: valorPrevComplementar },
            { name: 'sindicato', value: params.sindicato },
            { name: 'irpf', value: valorIR },
            { name: 'desconto teto', value: descontoTeto },
            { name: 'consignados', value: params.consignado }
        ]
    }, [receitas, params])

    const changeValue = useCallback((data: Partial<typeof params>) => {
        if('grg' in data) {
            console.log(data)
        }
        setParams(p => ({ ...p, ...data }))
    }, [params])


    const removeOutrasReceitasById = useCallback((id: string) => {
        setOutrasReceitas(old => old.filter(o => o.id != id))
    }, [outrasReceitas])

    return { changeValue, removeOutrasReceitasById, descontos, bcIR, bcPrevidencia, bcSaude, receitas, params, setParams, outrasReceitas, setOutrasReceitas }
}