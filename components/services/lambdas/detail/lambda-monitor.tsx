import { LambdaMetrics } from "@/lib/services/lambdas/lambda-metrics";

export default function LambdaMonitor({ lambdaMetrics }: { lambdaMetrics: LambdaMetrics[] }) {
    return (
        <div className="flex w-4/5 justify-center">
                    <div className="shadow-mdsm:rounded-lg w-full text-gray-500">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Image Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Time execution
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Time waiting
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Arguments
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Trigger At (UTC)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lambdaMetrics.map((lambda) => (
                                    <tr
                                        key={lambda.Id}
                                        className="cursor-pointer border-b  bg-gray-100  hover:bg-gray-50"
                                    >
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium"
                                        >
                                            {lambda.ImageName}
                                        </th>
                                        <td
                                            className="px-6 py-4"
                                        >
                                            {lambda.TimeExecutionInMs}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                        >
                                            {lambda.TimeWaitingInstanceInMs}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                        >
                                            {lambda.LambdaArg}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                        >
                                            {lambda.Created_at}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
    );
}
