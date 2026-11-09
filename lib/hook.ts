import { config } from "@/lib/config";
import { Receita } from "@/types";
import { filter, find, sumBy } from "lodash";
import { useCallback, useMemo, useState } from "react";



export function useHook() {
    const [outrasReceitas, setOutrasReceitas] = useState<Receita[]>([])

    const [params, setParams] = useState({
        grg: 42.0,
        ano: "2026",
        regiao_fiscal: 'I',
        faaf: 9500,
        dependentesIR: 0,
        nivel: '1',
        dependentesSF: 0,
        complementar: 8.5,
        sindicato: 0,
        cargo: 'AUDITOR',
        fidaf: 0,
        saude: true,
        ajuste: 0,
        consignado: 0,
        diasTrabalhados: 30,
        quinquenios: 0,
        regime_tributario: '1',
        teto: config.tetoSTF * 0.9025,
        abonoPermanencia: false
    })

    const receitas = useMemo(() => {


        const ano = params.ano as "2024";

        const nivel = params.nivel as "1"

        const vencimento = config.tabela[ano][nivel]

        const regiao_fiscal = params.regiao_fiscal as "I"

        const quocienteDiasTrabalhados = params.diasTrabalhados / 30;

        return [
            {
                id: 'vencimento',
                name: 'vencimento',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: vencimento * quocienteDiasTrabalhados,
                grupo: "remuneracao"
            },
            {
                id: 'grg',
                name: 'GRG - Gratificação por Resultado GOATE',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: (vencimento * params.grg / 100) * quocienteDiasTrabalhados,
                grupo: "remuneracao"
            },
            {
                id: 'gof',
                name: 'GOF - Gratificação por Operação Fiscal',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: (vencimento * config.regioes_fiscais[regiao_fiscal]) * quocienteDiasTrabalhados,
                grupo: "remuneracao"
            },
            {
                id: 'grv',
                name: 'GRV - Gratificação por Risco de Vida',
                ir: true,
                saude: true,
                previdencia: true,
                teto: true,
                value: (vencimento * 0.05) * quocienteDiasTrabalhados,
                grupo: "remuneracao"
            },
            {
                id: 'faaf',
                name: 'FAAF',
                ir: false,
                saude: false,
                previdencia: false,
                teto: false,
                value: (params.faaf) * quocienteDiasTrabalhados,
                grupo: "indenizacao"
            },
            {
                id: 'quinquenio',
                name: 'quinquênios',
                ir: false,
                saude: true,
                previdencia: false,
                teto: true,
                value: (vencimento * 0.05 * params.quinquenios) * quocienteDiasTrabalhados,
                grupo: "remuneracao"
            },
            ...outrasReceitas
        ]
    }, [params, config, outrasReceitas])

    const bcSaude = useMemo(() => {
        let geral_teto = sumBy(filter(receitas, { saude: true, teto: true }), 'value')
        let geral_no_teto = sumBy(filter(receitas, { saude: true, teto: false }), 'value')

        if (geral_teto > params.teto && params.teto) {
            geral_teto = params.teto
        }

        return geral_teto + geral_no_teto;
    }, [receitas])

    const bcPrevidencia = useMemo(() => {
        let geral_teto = sumBy(filter(receitas, { previdencia: true, teto: true }), 'value')
        let geral_no_teto = sumBy(filter(receitas, { previdencia: true, teto: false }), 'value')
        let geral_teto_no_prev = sumBy(filter(receitas, { previdencia: false, teto: true }), 'value')

        if (geral_teto > params.teto && params.teto) {
            geral_teto = params.teto - geral_teto_no_prev
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
        const no_ir_teto = sumBy(filter(receitas, { ir: false, teto: true }), 'value')

        if (ir_teto > params.teto && params.teto) {
            ir_teto = params.teto - no_ir_teto
        }

        return ir_teto + ir_no_teto - descontoDependente
    }, [receitas, params])

    const descontos = useMemo(() => {

        let valorFunape = bcPrevidencia.previdor * 0.14
        let valorPrevComplementar = bcPrevidencia.complementar * (params.complementar / 100)

        if (params.regime_tributario == '2') {
            valorFunape = (bcPrevidencia.previdor + bcPrevidencia.complementar) * 0.14
            valorPrevComplementar = 0;
        }

        const bcIR2 = bcIR - valorFunape - valorPrevComplementar;

        const valorIR = bcIR2 * 0.275 - 908.73

        const receitasTeto = sumBy(filter(receitas, { teto: true }), 'value')

        const descontoTeto = (params.teto < receitasTeto && params.teto) ? receitasTeto - params.teto : 0



        return [
            // { name: 'saude', value: params.saude ? bcSaude * 0.02 : 0 },
            { name: 'rgps', value: valorFunape, grupo: 'previdencia' },
            { name: 'Prev Complementar', value: valorPrevComplementar, grupo: 'previdencia' },
            { name: 'sindicato', value: params.sindicato, grupo: 'outros' },
            { name: 'irpf', value: valorIR, grupo: 'outros' },
            { name: 'desconto teto', value: descontoTeto, grupo: 'outros' },
            { name: 'consignados', value: params.consignado, grupo: 'outros' },
        ]
    }, [receitas, params])

    const changeValue = useCallback((data: Partial<typeof params>) => {
        if ('grg' in data) {
            console.log(data)
        }
        setParams(p => ({ ...p, ...data }))
    }, [params])


    const removeOutrasReceitasById = useCallback((id: string) => {
        setOutrasReceitas(old => old.filter(o => o.id != id))
    }, [outrasReceitas])

    const abonoPermanencia: Receita = useMemo(() => {

        const descontoPrev = find(descontos, { name: 'rgps' })

        return {
            id: 'abono-permanencia',
            name: 'ABONO DE PERMANENCIA',
            ir: false,
            saude: false,
            previdencia: false,
            teto: false,
            value: params.abonoPermanencia ? descontoPrev?.value ?? 0 : 0,
            grupo: "indenizacao"
        }
    }, [descontos])

    return { changeValue, removeOutrasReceitasById, descontos, bcIR, bcPrevidencia, bcSaude, receitas: [...receitas, abonoPermanencia], params, setParams, outrasReceitas, setOutrasReceitas }
}
