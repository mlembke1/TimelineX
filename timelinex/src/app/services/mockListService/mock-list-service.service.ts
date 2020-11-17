import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { IListInfo } from '../../webparts/spFxCrossSiteQueryPoc/IListInfo';

export class MockListServiceService {
  public static getLists(siteURL: string): Promise<IDropdownOption[]> {

    return new Promise(resolve => {
      setTimeout(() => {
        resolve([{
          key: siteURL + "|aaa-bbb-ccc-ddd|List Alpha",
          text: "List Alpha"
        },
        {
          key: siteURL + "|eee-fff-ggg-hhh|List Bravo",
          text: "List Bravo"
        },
        {
          key: siteURL + "|xxx-yyy-zzz|List Charlie",
          text: "List Charlie"
        }]);
      }, 250);
    });
  }
}

export class SPListItemServiceMockup {

  public static getListItemsFromMockup(list: IListInfo): Promise<IListInfo> {
    return new Promise((resolve, reject) => {
      list.ListItems = [];

      let numOfListItems = Math.floor(Math.random() * 10) + 1; //Generate a random number of list items since we're ont he mockup

      for (let i = 0; i < numOfListItems; i++) {
        list.ListItems.push({
          ListItemId: "ID#" + i.toString(),
          ListItemFields: [
            {
              FieldName: "Field 1",
              FieldValue: "Value 1"
            },
            {
              FieldName: "Field 2",
              FieldValue: "Value 2"
            },
            {
              FieldName: "Field 3",
              FieldValue: "Value 3"
            }
          ]
        });
      }

      setTimeout(() => {
        resolve(list);
      }, 250);
    });
  }
}