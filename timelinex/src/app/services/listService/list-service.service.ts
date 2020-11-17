import { SPListServiceMockup, SPListItemServiceMockup } from "./SPListServiceMockup";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { IListInfo, IListItemField } from '../../webparts/spFxCrossSiteQueryPoc/IListInfo';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export class ListServiceService {
    private wpContext: WebPartContext;  //The WebPartContext will have our authorization and refresh tokens

    constructor(context: WebPartContext) {
        this.wpContext = context;
    }

    public getLists(siteURL?: string): Promise<IDropdownOption[]> {
        if (!siteURL) {
            // resolve to empty since no url was supplied
            return Promise.resolve();
        }

        //Using local workbench - fake it 
        if (Environment.type == EnvironmentType.Local) {
            return SPListServiceMockup.getLists(siteURL);
        }
        else {
            return this.getListsFromSP(siteURL);
        }
    }

    private getListsFromSP(siteURL: string): Promise<IDropdownOption[]> {
        //Query SP via REST to get the lists available to the end user.
        //BaseTemplate 106 = Calendar.  Sort by the title for convenience
        //All list template IDs: https://docs.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-wssts/8bf797af-288c-4a1d-a14b-cf5394e636cf

        return new Promise(resolve => {
            //spHttpClient does a brand new call to SP, which is CORS compliant.  Similar to a CDN call - this also bakes in our authentication headers and tokens from the webpart context.

            this.wpContext.spHttpClient.get(siteURL + "/_api/web/lists?$filter=BaseTemplate eq 106&$select=Id,Title,ParentWebUrl&$orderby=Title asc", SPHttpClient.configurations.v1).then((response) => {
                response.json().then((result) => {
                    let returnSPLists: IDropdownOption[] = [];
                    result.value.forEach(element => {
                        returnSPLists.push({
                            key: [element.ParentWebUrl, element.Id, element.Title].join("|"),
                            text: element.Title
                        });
                        resolve(returnSPLists);
                    });
                });
            });
        });
    }

    public getListItems(wpLists: IListInfo[]): Promise<IListInfo[]> {
        if (wpLists.length == 0) { return Promise.resolve(); }

        let allListItemPromises: Promise<IListInfo>[] = [];

        //Using local workbench - fake it 
        if (Environment.type == EnvironmentType.Local) {
            //return SPListItemServiceMockup.getListItemsFromMockup();
            wpLists.map((listInfo, idx) => {
                //allListItemPromises.push(this.getListItemsFromSP(listInfo));
                allListItemPromises.push(SPListItemServiceMockup.getListItemsFromMockup(listInfo));
            });
        }
        else {        
            wpLists.map((listInfo, idx) => {
                allListItemPromises.push(this.getListItemsFromSP(listInfo));
            });
        }

        return Promise.all(allListItemPromises);
    }

    private getListItemsFromSP(list: IListInfo): Promise<IListInfo> {

        return new Promise((resolve, reject) => {
            this.wpContext.spHttpClient.get("https://socom.sharepoint-mil.us" + list.ParentWebUrl + "/_api/web/lists/GetByTitle('" + list.Title + "')/items?$select=*,Duration,RecurrenceData", SPHttpClient.configurations.v1).then((response) => {
                response.json().then((result) => {
                    list.ListItems = [];

                    result.value.forEach(spListItem => {
                        let listItemFieldValues: IListItemField[] = [];

                        Object.keys(spListItem).forEach(field => {
                            listItemFieldValues.push({
                                FieldName: field,
                                FieldValue: spListItem[field]
                            });
                        });

                        list.ListItems.push({
                            ListItemId: spListItem["Id"],
                            ListItemFields: listItemFieldValues
                        });
                    });
                    resolve(list);
                });
            });
        });
    }
}