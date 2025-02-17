export namespace main {
	
	export class Note {
	    Title: string;
	    Body: string;
	
	    static createFrom(source: any = {}) {
	        return new Note(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Title = source["Title"];
	        this.Body = source["Body"];
	    }
	}

}

