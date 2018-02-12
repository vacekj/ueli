import { expect } from "chai";
import { ElectronizrCommandExecutor } from "./../../../src/ts/executors/electronizr-command-executor";

describe("electronizr command executor", () => {
    describe("is valid for execution", () => {
        let executor = new ElectronizrCommandExecutor();

        it("should return true when passing in a valid electronizr command", () => {
            let validElectronizrCommands = [
                "ezr:exit",
                "ezr:reload"
            ];

            for (let validElectronizrCommand of validElectronizrCommands) {
                let actual = executor.isValidForExecution(validElectronizrCommand);
                expect(actual).to.be.true;
            }
        });

        it("should return false when passing in an invalid electronizr command", () => {
            let invalidElectronizrCommands = [
                "this is some shit",
                "ezr-start",
                "ezr.start",
                "ezr",
                "ezr:",
                "/asdfky"
            ];

            for (let invalidElectronizrCommmand of invalidElectronizrCommands) {
                let actual = executor.isValidForExecution(invalidElectronizrCommmand);
                expect(actual).to.be.false;
            }
        });
    });
});