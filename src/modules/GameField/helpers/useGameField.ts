import { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "../types/Player";
import { GameStatus } from "../types/GameStatus";
import { Effect } from "../types/Effect";
import { Spell } from "../types/Spell";

export const useGameField = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [scores, setScores] = useState<{ player1: number; player2: number }>({
    player1: 0,
    player2: 0,
  });
  const [isOpenSettingsModal, setIsOpenSettingsModal] =
    useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [playersSpeed, setPlayersSpeed] = useState<Array<number>>([2, 2]);
  const [shootingSpeeds, setShootingSpeeds] = useState<Array<number>>([
    1000, 1000,
  ]); // Время в миллисекундах между выстрелами для каждого игрока
  const [playersSpellsColor, setPlayersSpellsColor] = useState<string[]>([
    "blue",
    "red",
  ]);
  const playersRef = useRef<Player[]>([]);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState<boolean>(true);

  const startGame = () => {
    setGameStatus("play");
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      // Настройки канваса
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const players = initPlayers(canvas, shootingSpeeds);
      playersRef.current = players;
      const effects: Effect[] = [];
      if (gameStatus === "play") {
        startGameLoop(
          gameStatus,
          context,
          canvas,
          players,
          setSelectedPlayer,
          setScores,
          effects
        );
      }
    }
  };

  useEffect(() => {
    const isWinner = Object.values(scores).some((score) => score === 5);
    if (isWinner) {
      setGameStatus("win");
    }
  }, [scores]);

  useEffect(() => {
    if (gameStatus === "win") {
      setGameStatus("idle"); // Сбрасываем статус игры до начального состояния
      setIsNewGameModalOpen(true); // Открываем модальное окно для начала новой игры
    }
  }, [gameStatus]);

  useEffect(() => {
    if (isNewGameModalOpen) return;
    startGame();
  }, [isNewGameModalOpen]);
  //

  useEffect(() => {
    if (gameStatus === "pause" || gameStatus === "win") {
      // Остановка всех интервалов стрельбы
      playersRef.current.forEach((player) => {
        clearInterval(player.shootInterval);
        player.shootInterval = undefined;
        player.speed = 0;
      });
    } else if (gameStatus === "play") {
      // Возобновление интервалов стрельбы
      playersRef.current.forEach((player, index) => {
        if (!player.shootInterval) {
          player.shootInterval = setInterval(
            () => shootSpell(player),
            shootingSpeeds[index]
          );
        }
        player.speed = playersSpeed[index];
      });
    }
  }, [gameStatus, shootingSpeeds]);

  const handleColorChange = (color: string, id?: number) => {
    const player =
      id !== undefined ? playersRef.current[id] : (selectedPlayer as Player);
    player.spellColor = color;
    const newPlayersSpellColor = [...playersSpellsColor];
    newPlayersSpellColor[player.id] = color;
    setPlayersSpellsColor(newPlayersSpellColor);
  };

  const handleChangePlayerSpeed = (speed: number, id?: number) => {
    if (selectedPlayer || id !== undefined) {
      setPlayersSpeed(() => {
        const newPlayersSpeed = [...playersSpeed];
        newPlayersSpeed[
          id !== undefined ? id : (selectedPlayer?.id as number)
        ] = speed;
        return newPlayersSpeed;
      });
      if (selectedPlayer) selectedPlayer.speed = speed;
    }
  };

  const handleChangeShootSpeed = (speed: number, id?: number) => {
    if (selectedPlayer || id !== undefined) {
      setShootingSpeeds(() => {
        const newShootingSpeeds = [...shootingSpeeds];
        newShootingSpeeds[
          id !== undefined ? id : (selectedPlayer?.id as number)
        ] = 2050 - speed;

        // Перезапуск интервала для стрельбы с новой скоростью
        const interval =
          id !== undefined
            ? playersRef.current[id].shootInterval
            : (selectedPlayer?.shootInterval as NodeJS.Timeout);
        clearInterval(interval);

        const player =
          id !== undefined
            ? playersRef.current[id]
            : (selectedPlayer as Player);

        player.shootInterval = setInterval(
          () => shootSpell(player),
          2050 - speed
        );

        return newShootingSpeeds;
      });
    }
  };

  const winnerText = useMemo(() => {
    if (gameStatus === "win" || gameStatus === "idle") {
      if (scores.player1 >= 5 && scores.player1 === scores.player2) {
        return "Ничья";
      }
      if (scores.player1 >= 5 || scores.player2 >= 5) {
        return scores.player1 > scores.player2
          ? "Выиграл игрок Синий"
          : "Выиграл игрок Красный";
      }
    }
    return "";
  }, [gameStatus]);

  const handleStartNewGame = () => {
    // Сбрасываем состояние игроков
    playersRef.current.forEach((player) => {
      clearInterval(player.shootInterval);
      player.shootInterval = undefined;
    });
    playersRef.current = [];
    setIsNewGameModalOpen(false);
    setScores({ player1: 0, player2: 0 });
    setSelectedPlayer(null);
    setShootingSpeeds([1000, 1000]);
    setPlayersSpeed([2, 2]); // значение скорости, соответствующее начальной настройке
    setPlayersSpellsColor(["blue", "red"]);
    setGameStatus("play");
    startGame(); // Запускаем новую игру
  };

  // Инициализация игроков
  const initPlayers = (
    canvas: HTMLCanvasElement,
    shootingSpeeds: Array<number>
  ): Player[] => {
    const player1 = createPlayer(
      60,
      canvas.height / 2,
      "blue",
      1,
      "Синий",
      shootingSpeeds
    );
    const player2 = createPlayer(
      canvas.width - 60,
      canvas.height / 2,
      "red",
      2,
      "Красный",
      shootingSpeeds
    );

    return [player1, player2];
  };

  // Игровой цикл
  const startGameLoop = (
    gameStatus: GameStatus,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    players: Player[],
    setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>,
    setScores: React.Dispatch<
      React.SetStateAction<{ player1: number; player2: number }>
    >,
    effects: Effect[]
  ) => {
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Обновление и отрисовка игроков
      players.forEach((player) => {
        updatePlayer(
          player,
          context,
          canvas,
          mouseX,
          mouseY,
          players,
          setScores,
          effects,
          gameStatus
        );
      });

      // Обновление и отрисовка эффектов
      updateEffects(context, effects);

      requestAnimationFrame(animate);
    };

    // Обработка движения мыши
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    // Обработка клика
    const handleCanvasClick = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const clickedPlayer = players.find((player) =>
        isPlayerClicked(player, clientX, clientY)
      );
      setSelectedPlayer(clickedPlayer || null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleCanvasClick);

    if (gameStatus != "pause") animate();
  };

  const createPlayer = (
    x: number,
    y: number,
    color: string,
    id: number,
    name: string,
    shootingSpeeds: number[]
  ): Player => {
    const player: Player = {
      x,
      y,
      radius: 30,
      color,
      speed: 2,
      direction: 1,
      spellColor: color,
      spells: [],
      id,
      score: 0,
      name,
      isHit: false,
    };

    // Интервал стрельбы, привязанный к состоянию `shootingSpeeds`
    const shootInterval = setInterval(
      () => shootSpell(player),
      shootingSpeeds[id - 1]
    );

    // Сохранение интервала для возможности его обновления
    player.shootInterval = shootInterval;

    return player;
  };

  // Обновление игрока
  const updatePlayer = (
    player: Player,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mouseX: number,
    mouseY: number,
    players: Player[],
    setScores: React.Dispatch<
      React.SetStateAction<{ player1: number; player2: number }>
    >,
    effects: Effect[],
    gameStatus: GameStatus
  ) => {
    if (gameStatus !== "play") return;
    // Движение игрока
    player.y += player.speed * player.direction;
    if (
      player.y + player.radius > canvas.height ||
      player.y - player.radius < 0
    ) {
      player.direction *= -1;
    }

    // Обновление заклинаний
    player.spells.forEach((spell, index) => {
      updateSpell(spell, context);
      // Проверка попадания по другому игроку
      const hitPlayer = players.find(
        (p) => p.id !== player.id && isSpellHitPlayer(spell, p)
      );
      if (hitPlayer) {
        player.spells.splice(index, 1);
        player.score += 1;

        // Обновление счета
        setScores((prevScores) => ({
          player1: player.id === 1 ? player.score : prevScores.player1,
          player2: player.id === 2 ? player.score : prevScores.player2,
        }));

        // Добавление визуального эффекта
        createHitEffect(hitPlayer.x, hitPlayer.y, effects);

        // Изменение смайлика игрока на недовольный
        hitPlayer.isHit = true;
        setTimeout(() => {
          hitPlayer.isHit = false;
        }, 1000);
      }

      // Удаление заклинания, если оно вышло за границы
      if (spell.x + spell.radius < 0 || spell.x - spell.radius > canvas.width) {
        player.spells.splice(index, 1);
      }
    });

    drawPlayer(player, context);

    // Проверка на столкновение с мышью
    checkPlayerCollisionWithMouse(player, mouseX, mouseY);
  };

  // Проверка попадания заклинания в игрока
  const isSpellHitPlayer = (spell: Spell, player: Player): boolean => {
    const dist = Math.sqrt(
      (spell.x - player.x) ** 2 + (spell.y - player.y) ** 2
    );
    return dist <= player.radius + spell.radius;
  };

  // Отрисовка игрока с смайликом
  const drawPlayer = (player: Player, context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    context.fillStyle = player.color;
    context.fill();
    context.closePath();

    // Добавление смайлика в центр игрока
    context.font = "35px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    const smiley = player.isHit ? "😡" : "🙂";
    context.fillText(smiley, player.x, player.y);
  };

  // Проверка на столкновение с мышью
  const checkPlayerCollisionWithMouse = (
    player: Player,
    mouseX: number,
    mouseY: number
  ) => {
    const dist = Math.sqrt((player.x - mouseX) ** 2 + (player.y - mouseY) ** 2);
    const combinedRadius = player.radius + 20; // Радиус взаимодействия с мышью
    if (dist < combinedRadius) {
      player.direction *= -1; // Меняем направление движения
    }
  };

  // Проверка клика по игроку
  const isPlayerClicked = (
    player: Player,
    mouseX: number,
    mouseY: number
  ): boolean => {
    const dist = Math.sqrt((player.x - mouseX) ** 2 + (player.y - mouseY) ** 2);
    return dist <= player.radius;
  };

  // Создание заклинания
  const shootSpell = (player: Player) => {
    const direction = player.x > window.innerWidth / 2 ? -1 : 1;
    player.spells.push({
      x: player.x,
      y: player.y,
      radius: 10,
      color: player.spellColor,
      speed: 10,
      direction,
    });
  };

  // Обновление заклинания
  const updateSpell = (spell: Spell, context: CanvasRenderingContext2D) => {
    spell.x += spell.speed * spell.direction;
    drawSpell(spell, context);
  };

  // Отрисовка заклинания
  const drawSpell = (spell: Spell, context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.arc(spell.x, spell.y, spell.radius, 0, Math.PI * 2);
    context.fillStyle = spell.color;
    context.fill();
    context.closePath();
  };

  // Создание эффекта попадания
  const createHitEffect = (x: number, y: number, effects: Effect[]) => {
    effects.push({ x, y, radius: 0, maxRadius: 50, opacity: 1 });
  };

  // Обновление эффектов
  const updateEffects = (
    context: CanvasRenderingContext2D,
    effects: Effect[]
  ) => {
    effects.forEach((effect, index) => {
      effect.radius += 2;
      effect.opacity -= 0.02;

      if (effect.opacity <= 0) {
        effects.splice(index, 1); // Удаляем эффект, когда он становится невидимым
        return;
      }

      drawEffect(effect, context);
    });
  };

  // Отрисовка эффекта попадания
  const drawEffect = (effect: Effect, context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(255, 255, 0, ${effect.opacity})`;
    context.lineWidth = 5;
    context.stroke();
    context.closePath();
  };

  return {
    handleColorChange,
    handleStartNewGame,
    winnerText,
    handleChangeShootSpeed,
    handleChangePlayerSpeed,
    isOpenSettingsModal,
    setIsOpenSettingsModal,
    canvasRef,
    scores,
    selectedPlayer,
    playersSpellsColor,
    playersSpeed,
    shootingSpeeds,
    setGameStatus,
    setShootingSpeeds,
    gameStatus,
  };
};
