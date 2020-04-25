
import { EylemPlaniKunyeTable } from './eylem-plani-kunye.table';
import { PlatformKunyeTable } from './platform-kunye.table';
import { EylemPlaniMaddeTable } from './eylem-plani-madde.table';
export class TekizDataContext {
  public static eylemPlaniMaddes: any = EylemPlaniMaddeTable.eylemPlaniMaddes;
  public static platformKunyes: any = PlatformKunyeTable.platformKunyes;
  public static eylemPlaniKunyes: any = EylemPlaniKunyeTable.eylemPlaniKunyes;
}
