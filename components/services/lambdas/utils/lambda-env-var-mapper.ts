import { LambdaEnvironmentVariable } from '@/lib/models/lambdas/lambda-create';


export const lambdaModelEnvToLambdaEnvironment = (lambdaVars: {key: string, value: string}[]): LambdaEnvironmentVariable[] => {
    return lambdaVars.map((lambdaVar) => {
        console.log("lambdaVar")
        console.log(lambdaVar)
        return {
            name: lambdaVar.key,
            value: lambdaVar.value,
        };
    });
};