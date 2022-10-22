//in this space we put all the logic for the flow
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";



export class SpaceStack extends Stack {
     
    private api = new RestApi(this,'SpaceApi');
    private spacesTable = new GenericTable(
        'SpaceTable',
        'spaceId',
        this
    );


    constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);


    // const helloLambda = new LambdaFunction(this, "helloLambda", {
    //   runtime: Runtime.NODEJS_16_X,
    //   code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
    //   handler: "hello.main",
    // });

    const helloLambdaWebpack = new LambdaFunction(this, "helloLambdaWebpack", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(join(__dirname, "..", "build", "nodeHelloLambda")),
      handler: "nodeHelloLambda.handler",
    });

    

    const helloLambdaNodeJs = new NodejsFunction(this,'helloLambdaNodeJs',{
        entry: join(__dirname, "..", "services", "node_lambda",'hello.ts'),
        handler: "handler"
    });

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);
    
    //Hello Lambda Integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET',helloLambdaIntegration);

    
  }
}
