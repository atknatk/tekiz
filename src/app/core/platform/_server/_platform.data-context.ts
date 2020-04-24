import { CountriesTable } from './countries.table';
import { PlatformKunyeTable } from './platform-kunye.table';
export class PlatformDataContext {
  public static countries: any = CountriesTable.countries;
  public static platformKunyes: any = PlatformKunyeTable.platformKunyes;
}
