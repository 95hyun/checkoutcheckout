#!/bin/bash

# 1. global.exception 패키지 삭제
rm -rf src/main/java/com/toy/checkoutcheckout/global/exception/

# 2. 불필요한 plan 예외 클래스 삭제
rm -f src/main/java/com/toy/checkoutcheckout/domain/plan/exception/PlanNotFoundException.java
rm -f src/main/java/com/toy/checkoutcheckout/domain/plan/exception/InvalidPlanException.java

echo "불필요한 예외 클래스 정리 완료!"
