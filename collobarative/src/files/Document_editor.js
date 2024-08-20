import React from 'react';
import {useRole} from './Rolecontext';

const Documenteditor=()=>{

    const {haspermision}=useRole();
    return(
        <div>
            {haspermision('createdocument')&&(
                <button>create document</button>
            )}
            {haspermision('editdocument')&&(
                <button>edit document</button>
            )}

            {!haspermision('viewdocument')&&(
                <p>You don't have permission to view this document.</p>
            )}

        </div>
    )

}

export default Documenteditor;
