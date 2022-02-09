declare module "@semantic-release/error" {
  class SemanticReleaseError {
    private message: string;
    private code: string;
    private details: any;

    constructor(message: string, code: string, details?: any);
  }

  export = SemanticReleaseError;
}
