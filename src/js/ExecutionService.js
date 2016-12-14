import ProgramExecutor from './ProgramExecutor.js';
import FilePathExecutor from './FilePathExecutor.js';
import WebUrlExecutor from './WebUrlExecutor.js';
import ShellExecutor from './ShellCommandExecutor.js';
import EzrCommandExecutor from './EzrCommandExecutor.js';
import WebSearchExecutor from './WebSearchExecutor.js';

export default class ExecutionService {
    constructor() {
        this.executors = [
            new ProgramExecutor(),
            new FilePathExecutor(),
            new WebUrlExecutor(),
            new ShellExecutor(),
            new EzrCommandExecutor(),
            new WebSearchExecutor()
        ];
    }

    execute(arg) {
        for (let executor of this.executors)
            if (executor.isValid(arg)) {
                executor.execute(arg);
                return true;
            }

        return false;
    }
}