"""Calcula impacto observado desde capturas DOM. No navega ni ejecuta tests."""
from pathlib import Path
from decimal import Decimal
import json

base=Path(__file__).resolve().parent
home=json.loads((base/'BUG-002-home-attempts.json').read_text())
runs=[]
for i in [1,2]:
    d=json.loads((base/f'BUG-003-price-sort-attempt{i}.json').read_text())
    prices=[Decimal(x['price'].removeprefix('$')) for x in d['products']]
    bad=[j for j in range(len(prices)-1) if prices[j]>prices[j+1]]
    runs.append({'attempt':i,'selected':d['selected'],'value':d['value'],'products':len(prices),'adjacent_pairs':max(0,len(prices)-1),'ascending_violations':len(bad),'first_price':str(prices[0]),'last_price':str(prices[-1]),'violation_indexes_zero_based':bad})
result={'BUG-002':{'attempts':len(home),'contact_instead_of_home':sum(x['afterUrl'].endswith('/contact') and x['contactVisible'] for x in home)},'BUG-003':{'attempts':runs,'scope':'Primera página visible; dos intentos en la misma sesión. No mide usuarios ni catálogo completo.'}}
(base/'impact-measurements.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
