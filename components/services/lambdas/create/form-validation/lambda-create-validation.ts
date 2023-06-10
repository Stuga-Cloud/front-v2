export const isLambdaNameValid = (lambdaName: string): boolean => {
    var regex = /^[a-zA-Z0-9]*$/;

    return lambdaName.length > 4 && regex.test(lambdaName);
};

export const isLambdaImageNameValid = (imageName: string): boolean => {
    var regex = /^[a-zA-Z0-9-]*$/;

    return imageName.length > 4 && regex.test(imageName);
};
