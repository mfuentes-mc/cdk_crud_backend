//Contains the logic for launch the project
import { SpaceStack } from "./SpaceStack";
import { App } from "aws-cdk-lib";


const app= new App();
new SpaceStack(app,'Space-finder',{
    stackName:'SpaceFinder'
});